"use server";

import { getExpenses, getProject } from "@/app/landing/@expenses/dashboardActions";
import {
  getFirstDayOfTheFollowingMonthInScoreFormat,
  getFirstDayOfTheMonthInScoreFormat,
} from "@/app/landing/utils";
import { initialState } from "@/app/providers/generalReducer";
import { RemainingBudgetChartDataProps } from "./components/remainingBudget";

type MakePropRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export const getSelectedMonthExpensesGroupedByDay = async (
  selectedDate: Date
): Promise<RemainingBudgetChartDataProps[]> => {
  const project = await getProject(initialState.currentProject);
  const currentMonthlyBudget = project?.dailyBudget! * 30;
  const selectedDateFirstDayOfTheMonth =
    getFirstDayOfTheMonthInScoreFormat(selectedDate);
  const selectedDateFirstDayOfTheFollowingMonth =
    getFirstDayOfTheFollowingMonthInScoreFormat(selectedDate);
  const daysInMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    0
  ).getDate();
  let remainingBudget = currentMonthlyBudget;

  const datesArray = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      i + 1
    );
    return { name: date.toLocaleDateString(), date };
  });

  return await getExpenses(
    `${initialState.currentProject}:expenses`,
    selectedDateFirstDayOfTheMonth,
    selectedDateFirstDayOfTheFollowingMonth
  )
    .then((expensesIndexes) =>
      expensesIndexes.reduce(
        (acc, expense) => {
          const dateInStringFormat = expense.index.substring(8, 16);
          const expenseKey = Number.parseInt(
            dateInStringFormat.substring(6, 8)
          );
          const correspondingData = acc[expenseKey];
          remainingBudget -= Number.parseFloat(expense.amount as string);
          correspondingData.remainingBudget = remainingBudget;

          return acc;
        },
        [
          {
            name: "",
            remainingBudget: currentMonthlyBudget,
            controlBudget: currentMonthlyBudget,
          },
          ...datesArray,
        ] as MakePropRequired<
          RemainingBudgetChartDataProps,
          "remainingBudget"
        >[]
      )
    )
    .then((chartData: RemainingBudgetChartDataProps[]) => {
      chartData[chartData.length - 1].controlBudget = 0;

      return chartData;
    });
};
