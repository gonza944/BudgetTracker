"use server";

import { Redis } from "@upstash/redis";
import { cache } from "react";
import { PROJECTNAME } from "./page";

export interface ProjectBudget {
  budget: number;
  total_expenses: number;
  dailyBudget: number;
  projectName: string;
}

export interface Expense {
  category: string;
  description: string;
  amount: number;
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
  async (projectName: string, fromDate: number, toDate: number) => {
    const expensesIndexes: string[] = await redis.zrange(
      projectName,
      fromDate,
      toDate,
      { byScore: true }
    );

    return await Promise.all(
      expensesIndexes.map(
        (name) => redis.hgetall(name) as Promise<Expense | null>
      )
    ).then(
      (expenses) => expenses.filter((expense) => expense !== null) as Expense[]
    );
  }
);

export const monthlyBudget = cache(
  async (project: ProjectBudget, fromDate: number, toDate: number) => {
    const montlyExpensesIndexes = await getExpensesIndexes(
      `${PROJECTNAME}:expenses`,
      fromDate,
      toDate
    );

    return await Promise.all(
      montlyExpensesIndexes.map(
        (name: string) => redis.hgetall(name) as Promise<Expense | null>
      )
    )
      .then(
        (expenses) =>
          expenses.filter((expense) => expense !== null) as Expense[]
      )
      .then((expensesNotNull) =>
        expensesNotNull.reduce((acc, expense) => acc + expense.amount, 0)
      )
      .then((totalExpenses) => project?.dailyBudget! * 30 - totalExpenses);
  }
);
