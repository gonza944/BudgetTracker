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

export const createNewExpense = cache(
  async (formData: FormData, expenseDate: Date) => {
    const rawFormData = {
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      amount: Number.parseInt(formData.get("amount") as string),
    };
    try {
      if (
        rawFormData.description &&
        rawFormData.amount &&
        rawFormData.category
      ) {
        const tx = redis.multi();
        const year = expenseDate.getFullYear(),
          month = expenseDate.getMonth() + 1,
          date = expenseDate.getDate();
        const expenseOfDayNumber = await redis.zcount(
          `${PROJECTNAME}:expenses`,
          Number.parseInt(`${year}${month}${date}1`),
          Number.parseInt(`${year}${month}${date + 1}1`)
        );

        tx.zadd(`${PROJECTNAME}:expenses`, {
          score: Number.parseInt(
            `${year}${month}${date}${expenseOfDayNumber + 1}`
          ),
          member: `expense:${year}${month}${date}${expenseOfDayNumber + 1}`,
        });
        tx.hset(
          `expense:${year}${month}${date}${expenseOfDayNumber + 1}`,
          rawFormData
        );
        tx.hincrby(PROJECTNAME, "total_expenses", rawFormData.amount);
        tx.sadd("categories", rawFormData.category); 


        await tx.exec();
      }
    } catch (error) {}
  }
);
