"use server";

import { Redis } from "@upstash/redis";
import { cache } from "react";
import z from "zod";
import {
  FIRSTEXPENSE,
  getDateInScoreFormatWithoutExpenseNumber
} from "./utils";
import { createNewExpenseSchema } from "../store/schemas";

const ProjectBudgetSchema = z.object({
  budget: z.number(),
  total_expenses: z.number(),
  dailyBudget: z.number(),
  projectName: z.string(),
})
export type ProjectBudgetTypes = z.infer<typeof ProjectBudgetSchema>;

const expensesIndexes = z.array(z.string());

const redis = Redis.fromEnv();

export const getProject = cache(
  async (projectName: string) => {
    const project = await redis.hmget(
      projectName,
      "budget",
      "dailyBudget",
      "total_expenses",
      "projectName"
    );
    return ProjectBudgetSchema.parse(project);
  })

const getExpensesIndexes = cache(
  async (projectName: string, fromDate: number, toDate: number) => {
    const indexes = await redis.zrange(projectName, fromDate, toDate, {
      byScore: true,
    });

    return expensesIndexes.parse(indexes);
  }
);

const ExpenseSchemaObject = z.object({
  category: z.string(),
  description: z.string(),
  amount: z.union([z.string(), z.number()]),
  index: z.string()
});


const ExpensesSchema = z.object({
  expensesName: z.string(),
  fromDate: z.number(),
  toDate: z.number(),
}).transform(async (data) => {
  const expensesIndexes = await getExpensesIndexes(
    data.expensesName,
    data.fromDate,
    data.toDate
  );
  const expenses = await Promise.all(
    expensesIndexes.map(async (name) => ({
      ...(await redis.hgetall(name)),
      index: name
    }))
  );

  return ExpenseSchemaObject.array().parse(expenses);
}).transform((expenses) =>
  expenses.filter((expense) => expense?.amount !== null)
);

export type Expense = z.infer<typeof ExpenseSchemaObject>;
export type ExpensesArray = z.infer<typeof ExpensesSchema>;

export const getExpenses = cache(
  async (expensesName: string, fromDate: number, toDate: number) => {
    return await ExpensesSchema.parseAsync({
      expensesName: expensesName,
      fromDate: fromDate,
      toDate: toDate,
    });
  }
);

export type CreateNewExpenseRawData = z.infer<typeof createNewExpenseSchema>;

export const createNewExpense = cache(
  async (rawFormData: CreateNewExpenseRawData, expenseDate: Date, projectName: string): Promise<{ data: Expense, success: true } | { success: false, data: undefined }> => {
    try {

      const tx = redis.multi();
      const theFollowingDay = new Date(expenseDate);
      theFollowingDay.setDate(theFollowingDay.getDate() + 1);
      const todayInScoreFormat =
        getDateInScoreFormatWithoutExpenseNumber(expenseDate);
      const tomorrowInScoreFormat =
        getDateInScoreFormatWithoutExpenseNumber(theFollowingDay);

      const expenseOfDayNumber = await z.number().transform((count) => count + 1).transform((count) => count.toString().padStart(4, "0")).parseAsync(await redis
        .zcount(
          `${projectName}:expenses`,
          Number.parseInt(`${todayInScoreFormat}${FIRSTEXPENSE}`),
          Number.parseInt(`${tomorrowInScoreFormat}${FIRSTEXPENSE}`)
        ))

      tx.zadd(`${projectName}:expenses`, {
        score: Number.parseInt(`${todayInScoreFormat}${expenseOfDayNumber}`),
        member: `expense:${todayInScoreFormat}${expenseOfDayNumber}`,
      });
      tx.hset(
        `expense:${todayInScoreFormat}${expenseOfDayNumber}`,
        rawFormData
      );
      tx.hincrbyfloat(
        projectName,
        "total_expenses",
        rawFormData.amount
      );
      tx.sadd("categories", rawFormData.category);

      await tx.exec();
      return {
        success: true,
        data: {
          ...rawFormData,
          index: `expense:${todayInScoreFormat}${expenseOfDayNumber}`,
          category: rawFormData.category ?? "",
          description: rawFormData.description ?? "",
        }
      };
    } catch (error) {
      console.error("error", error);
      return {
        success: false,
        data: undefined
      };
    }
  }
);

export const removeExpense = cache(async (expense: Expense, projectName: string) => {
  const validatedExpense = ExpenseSchemaObject.parse(expense);
  const tx = redis.multi();
  tx.hdel(validatedExpense.index, "description", "category", "amount");
  tx.zrem(`${projectName}:expenses`, validatedExpense.index);
  tx.hincrbyfloat(
    projectName,
    "total_expenses",
    -validatedExpense.amount
  );

  await tx.exec();
});
