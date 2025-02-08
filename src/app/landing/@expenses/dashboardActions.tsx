"use server";

import { Redis } from "@upstash/redis";
import { cache } from "react";
import { initialState } from "../../providers/generalReducer";
import {
  FIRSTEXPENSE,
  getDateFromScore,
  getDateInScoreFormatWithoutExpenseNumber,
  getFirstAndLastDayOfTheMonthInScoreFormat
} from "../utils";
import z from "zod";

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


const ExpensesSchema = z.object({
  expensesName: z.string(),
  fromDate: z.number(),
  toDate: z.number(),
}).transform(async (data) => {
  const expensesIndexes = await getExpensesIndexes(
    `${initialState.currentProject}:expenses`,
    data.fromDate,
    data.toDate
  );
  const ExpenseSchema = z.object({
    category: z.string(),
    description: z.string(),
    amount: z.union([z.string(), z.number()]),
    index: z.string()
  });

  const expenses = await Promise.all(
    expensesIndexes.map(async (name) => ({
      ...(await redis.hgetall(name)),
      index: name
    }))
  );

  return ExpenseSchema.array().parse(expenses);
}).transform((expenses) =>
  expenses.filter((expense) => expense?.amount !== null)
);

export type Expense = z.infer<typeof ExpensesSchema>[0];

export const getExpenses = cache(
  async (expensesName: string, fromDate: number, toDate: number) => {
    return await ExpensesSchema.parseAsync({
      expensesName: expensesName,
      fromDate: fromDate,
      toDate: toDate
    });
  }
);

export const getExpensesForADay = cache(async (score: number) => {
  const date = getDateFromScore(score);
  const { firstDay, lastDay } = getFirstAndLastDayOfTheMonthInScoreFormat(date.getMonth());

  return await getExpenses(
    `${initialState.currentProject}:expenses`,
    firstDay,
    lastDay
  ).then((expenses) =>
    expenses.filter((expense) =>
      expense.index.includes(score.toString().substring(0, 8))
    )
  );
});

export const monthlyBudget = cache(async (month: number) => {
  const project = await getProject(initialState.currentProject);
  const { firstDay, lastDay } =
    getFirstAndLastDayOfTheMonthInScoreFormat(month);
  return await getExpenses(
    `${initialState.currentProject}:expenses`,
    firstDay,
    lastDay
  )
    .then((expensesNotNull) =>
      expensesNotNull.reduce(
        (acc, expense) => acc + Number.parseFloat(expense.amount as string),
        0
      )
    )
    .then((totalExpenses) => project?.dailyBudget! * 30 - totalExpenses);
});

const createNewExpenseSchema = z.object({
  description: z.string(),
  category: z.string(),
  amount: z.number(),
});

export const createNewExpense = cache(
  async (formData: FormData, expenseDate: Date) => {
    try {
      const rawFormData = createNewExpenseSchema.parse(formData);

      const tx = redis.multi();
      const theFollowingDay = new Date(expenseDate);
      theFollowingDay.setDate(theFollowingDay.getDate() + 1);
      const todayInScoreFormat =
        getDateInScoreFormatWithoutExpenseNumber(expenseDate);
      const tomorrowInScoreFormat =
        getDateInScoreFormatWithoutExpenseNumber(theFollowingDay);

      const expenseOfDayNumber = z.number().transform((count) => count + 1).transform((count) => count.toString().padStart(4, "0")).parseAsync(await redis
        .zcount(
          `${initialState.currentProject}:expenses`,
          Number.parseInt(`${todayInScoreFormat}${FIRSTEXPENSE}`),
          Number.parseInt(`${tomorrowInScoreFormat}${FIRSTEXPENSE}`)
        ))

      tx.zadd(`${initialState.currentProject}:expenses`, {
        score: Number.parseInt(`${todayInScoreFormat}${expenseOfDayNumber}`),
        member: `expense:${todayInScoreFormat}${expenseOfDayNumber}`,
      });
      tx.hset(
        `expense:${todayInScoreFormat}${expenseOfDayNumber}`,
        rawFormData
      );
      tx.hincrbyfloat(
        initialState.currentProject,
        "total_expenses",
        rawFormData.amount
      );
      tx.sadd("categories", rawFormData.category);

      await tx.exec();
    } catch (error) {
      console.error("error", error);
    }
  }
);

export const removeExpense = cache(async (expense: Expense) => {
  const tx = redis.multi();
  tx.hdel(expense.index, "description", "category", "amount");
  tx.zrem(`${initialState.currentProject}:expenses`, expense.index);
  tx.hincrbyfloat(
    initialState.currentProject,
    "total_expenses",
    -expense.amount
  );

  await tx.exec();
});
