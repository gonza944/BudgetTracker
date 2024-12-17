"use server";

import { Redis } from "@upstash/redis";
import { cache } from "react";
import {
  FIRSTEXPENSE,
  getDateFromScore,
  getDateInScoreFormat,
  getDateInScoreFormatWithoutExpenseNumber,
  getFirstAndLastDayOfTheMonthInScoreFormat,
} from "../utils";
import { initialState } from "../../providers/generalReducer";

export interface ProjectBudget {
  budget: number;
  total_expenses: number;
  dailyBudget: number;
  projectName: string;
}

export interface Expense {
  category: string;
  description: string;
  amount: number | string;
  index: string;
}

const redis = Redis.fromEnv();

export const getProject = cache(
  async (projectName: string) =>
    (await redis.hmget(
      projectName,
      "budget",
      "dailyBudget",
      "total_expenses",
      "projectName"
    )) as ProjectBudget | null
);

export const getExpensesIndexes = cache(
  async (projectName: string, fromDate: number, toDate: number) =>
    (await redis.zrange(projectName, fromDate, toDate, {
      byScore: true,
    })) as string[]
);

export const getExpenses = cache(
  async (expensesName: string, fromDate: number, toDate: number) => {
    const expensesIndexes: string[] = await getExpensesIndexes(
      expensesName,
      fromDate,
      toDate
    );

    return await Promise.all(
      expensesIndexes.map(
        (name) => redis.hgetall(name) as Promise<Expense | null>
      )
    )
      .then((expenses) =>
        expenses.map((e, i) => ({ ...e, index: expensesIndexes[i] }))
      )
      .then(
        (expenses) =>
          expenses.filter((expense) => expense?.amount !== null) as Expense[]
      );
  }
);

export const getExpensesForADay = cache(async (score: number) => {
  const date = getDateFromScore(score);
  const {firstDay, lastDay} = getFirstAndLastDayOfTheMonthInScoreFormat(date.getMonth());

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

export const createNewExpense = cache(
  async (formData: FormData, expenseDate: Date) => {
    const rawFormData = {
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      amount: Number.parseFloat(formData.get("amount") as string),
    };
    try {
      if (
        rawFormData.description &&
        rawFormData.amount &&
        rawFormData.category
      ) {
        const tx = redis.multi();
        const theFollowingDay = new Date(expenseDate);
        theFollowingDay.setDate(theFollowingDay.getDate() + 1);
        const todayInScoreFormat =
          getDateInScoreFormatWithoutExpenseNumber(expenseDate);
        const tomorrowInScoreFormat =
          getDateInScoreFormatWithoutExpenseNumber(theFollowingDay);
        const expenseOfDayNumber = await redis
          .zcount(
            `${initialState.currentProject}:expenses`,
            Number.parseInt(`${todayInScoreFormat}${FIRSTEXPENSE}`),
            Number.parseInt(`${tomorrowInScoreFormat}${FIRSTEXPENSE}`)
          )
          .then((count) => count + 1)
          .then((count) => count.toString().padStart(4, "0"));

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
      }
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
