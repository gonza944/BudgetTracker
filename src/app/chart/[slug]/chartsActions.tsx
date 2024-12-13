"use server";

import {
  getExpenses,
  getExpensesIndexes,
  getProject,
  monthlyBudget,
} from "@/app/dashboard/dashboardActions";
import {
  FIRSTEXPENSE,
  getFirstDayOfTheFollowingMonthInScoreFormat,
  getFirstDayOfTheMonthInScoreFormat,
} from "@/app/dashboard/utils";
import { initialState } from "@/app/providers/generalReducer";
import { RemainingBudgetChartDataProps } from "./components/remainingBudget";
import { Redis } from "@upstash/redis";

export const getSelectedMonthExpensesGroupedByDay = async (
  selectedDate: Date
) => {
  const project = await getProject(initialState.currentProject);
  const currentMonthlyBudget = project?.dailyBudget! * 30;
  const selectedDateFirstDayOfTheMonth =
    getFirstDayOfTheMonthInScoreFormat(selectedDate);
  const selectedDateFirstDayOfTheFollowingMonth =
    getFirstDayOfTheFollowingMonthInScoreFormat(selectedDate);

  return await getExpenses(
    `${initialState.currentProject}:expenses`,
    selectedDateFirstDayOfTheMonth,
    selectedDateFirstDayOfTheFollowingMonth
  ).then((expensesIndexes) =>
    expensesIndexes.reduce(
      (acc, expense) => {
        const date = expense.index.substring(8, 16);
        const alreadyExists = acc.some((e) => {
          const match = e.slug === date;
          if (match) {
            e.remainingBudget -= expense.amount;
          }
          return match;
        });

        if (!alreadyExists) {
          acc.push({
            slug: date,
            name: `${date.substring(6, 8)}/${date.substring(
              4,
              6
            )}/${date.substring(0, 4)}`,
            remainingBudget:
              acc[acc.length - 1].remainingBudget - expense.amount,
          });
        }
        return acc;
      },
      [
        { name: "", remainingBudget: currentMonthlyBudget },
      ] as RemainingBudgetChartDataProps[]
    )
  );
};
