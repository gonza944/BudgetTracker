"use server";

import { getExpenses, getProject } from "@/app/dashboard/dashboardActions";
import {
  getFirstDayOfTheFollowingMonthInScoreFormat,
  getFirstDayOfTheMonthInScoreFormat,
} from "@/app/dashboard/utils";
import { initialState } from "@/app/providers/generalReducer";
import { RemainingBudgetChartDataProps } from "./components/remainingBudget";

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
        const dateInStringFormat = expense.index.substring(8, 16);
        const date = new Date(
          Number.parseInt(dateInStringFormat.substring(0, 4)),
          Number.parseInt(dateInStringFormat.substring(4, 6)) - 1,
          Number.parseInt(dateInStringFormat.substring(6, 8))
        );

        const alreadyExists = acc.some((e) => {
          const match =
            e.date?.toLocaleDateString() === date.toLocaleDateString();
          if (match) {
            e.remainingBudget -= expense.amount;
          }
          return match;
        });

        if (!alreadyExists) {
          acc.push({
            date,
            name: date.toLocaleDateString(),
            remainingBudget:
              acc[acc.length - 1].remainingBudget - expense.amount,
          });
        }
        return acc;
      },
      [
        {
          name: "",
          remainingBudget: currentMonthlyBudget,
          controlBudget: currentMonthlyBudget,
        },
      ] as RemainingBudgetChartDataProps[]
    )
  );
};
