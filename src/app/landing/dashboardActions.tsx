"use server";

import {
  getUserCategoriesKey,
  getUserExpenseKey,
  getUserExpensesKey,
  getUserProjectKey,
  getUserProjectsKey,
} from "@/utils/userUtils";
import { Redis } from "@upstash/redis";
import { cache } from "react";
import z from "zod";
import { createNewExpenseSchema } from "../store/schemas";
import {
  FIRSTEXPENSE,
  getDateInScoreFormatWithoutExpenseNumber,
} from "./utils";

const ProjectBudgetSchema = z.object({
  budget: z.number(),
  total_expenses: z.number(),
  dailyBudget: z.number(),
  projectName: z.string(),
});
export type ProjectBudgetTypes = z.infer<typeof ProjectBudgetSchema>;

const expensesIndexes = z.array(z.string());

const redis = Redis.fromEnv();

export const getProject = cache(async (projectName: string) => {
  const project = await redis.hmget(
    projectName,
    "budget",
    "dailyBudget",
    "total_expenses",
    "projectName"
  );
  return ProjectBudgetSchema.parse(project);
});

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
  index: z.string(),
});

const ExpensesSchema = z
  .object({
    expensesName: z.string(),
    fromDate: z.number(),
    toDate: z.number(),
  })
  .transform(async (data) => {
    const expensesIndexes = await getExpensesIndexes(
      data.expensesName,
      data.fromDate,
      data.toDate
    );
    const expenses = await Promise.all(
      expensesIndexes.map(async (name) => ({
        ...(await redis.hgetall(name)),
        index: name,
      }))
    );

    return ExpenseSchemaObject.array().parse(expenses);
  })
  .transform((expenses) =>
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
  async (
    rawFormData: CreateNewExpenseRawData,
    expenseDate: Date,
    projectName: string,
    userEmail: string
  ): Promise<
    { data: Expense; success: true } | { success: false; data: undefined }
  > => {
    try {

      const tx = redis.multi();
      const theFollowingDay = new Date(expenseDate);
      theFollowingDay.setDate(theFollowingDay.getDate() + 1);
      const todayInScoreFormat =
        getDateInScoreFormatWithoutExpenseNumber(expenseDate);
      const tomorrowInScoreFormat =
        getDateInScoreFormatWithoutExpenseNumber(theFollowingDay);

      const userExpensesKey = getUserExpensesKey(userEmail, projectName);

      // Get count of expenses for the day and format as string with padding
      const expenseCount = await redis.zcount(
        userExpensesKey,
        Number.parseInt(`${todayInScoreFormat}${FIRSTEXPENSE}`),
        Number.parseInt(`${tomorrowInScoreFormat}${FIRSTEXPENSE}`)
      );

      // Convert to string and pad with zeros
      const expenseOfDayNumber = (expenseCount + 1).toString().padStart(4, "0");

      const expenseKey = getUserExpenseKey(
        userEmail,
        todayInScoreFormat.toString(),
        expenseOfDayNumber
      );

      // Calculate score as string first, then parse to number
      const scoreValue = Number.parseInt(
        `${todayInScoreFormat}${expenseOfDayNumber}`
      );

      tx.zadd(userExpensesKey, {
        score: scoreValue,
        member: expenseKey,
      });

      tx.hset(expenseKey, rawFormData);

      // Use string value for hincrbyfloat
      tx.hincrbyfloat(
        getUserProjectKey(userEmail, projectName),
        "total_expenses",
        rawFormData.amount
      );

      tx.sadd(getUserCategoriesKey(userEmail), rawFormData.category);

      await tx.exec();
      return {
        success: true,
        data: {
          ...rawFormData,
          index: expenseKey,
          category: rawFormData.category ?? "",
          description: rawFormData.description ?? "",
        },
      };
    } catch (error) {
      console.error("error", error);
      return {
        success: false,
        data: undefined,
      };
    }
  }
);

export const removeExpense = cache(
  async (expense: Expense, projectName: string) => {
    const validatedExpense = ExpenseSchemaObject.parse(expense);

    const tx = redis.multi();
    tx.hdel(validatedExpense.index, "description", "category", "amount");
    tx.zrem(projectName, validatedExpense.index);

    // Use string value for hincrbyfloat
    tx.hincrbyfloat(
      projectName,
      "total_expenses",
      -Number.parseFloat(validatedExpense.amount.toString())
    );

    await tx.exec();
  }
);
