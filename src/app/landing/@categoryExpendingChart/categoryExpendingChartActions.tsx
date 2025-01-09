"use server";

import { getExpenses } from "@/app/landing/@expenses/dashboardActions";
import { getFirstAndLastDayOfTheMonthInScoreFormat } from "@/app/landing/utils";
import { initialState } from "@/app/providers/generalReducer";
import { categoryExpendingChartDataProps } from "./page";

export const getSelectedMonthExpensesGroupedByCategory = async (
  month: number
): Promise<categoryExpendingChartDataProps[]> => {
  const { firstDay: firstDayAsScore, lastDay: lastDayAsScore } =
    getFirstAndLastDayOfTheMonthInScoreFormat(month);

  return await getExpenses(
    `${initialState.currentProject}:expenses`,
    firstDayAsScore,
    lastDayAsScore
  ).then((expenses) =>
    expenses.reduce((acc, expense) => {
      const category = acc.get(expense.category);

      if (category) {
        acc.set(
          expense.category,
          category + Number.parseFloat(`${expense.amount}`)
        );
      } else {
        acc.set(
          expense.category,
          Number.parseFloat(`${expense.amount}`)
        );
      }

      return acc;
    }, new Map<string, number>())
  ).then((expensesMap) => {
    return Array.from(expensesMap).map(([name, amount]) => ({
      name,
      amount,
    }));
  });
};
