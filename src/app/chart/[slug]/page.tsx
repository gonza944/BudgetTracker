import {
  getExpenses,
  getProject,
  monthlyBudget,
} from "@/app/dashboard/dashboardActions";
import {
  FIRSTEXPENSE,
  getFirstDayOfTheFollowingMonthInScoreFormat,
  getFirstDayOfTheMonthInScoreFormat,
} from "@/app/dashboard/utils";
import { initialState } from "@/app/providers/generalReducer";
import RemainingBudget, {
  RemainingBudgetChartDataProps,
} from "./components/remainingBudget";
import { getSelectedMonthExpensesGroupedByDay } from "./chartsActions";

export const CHARTTYPES = {
  monthlyRemainingBudget: "monthlyRemainingBudget",
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const calculateChartData = async (
    selectedDay: Date
  ): Promise<RemainingBudgetChartDataProps[]> => {
    return await getSelectedMonthExpensesGroupedByDay(selectedDay);
  };

  const chartData = await calculateChartData(initialState.selectedExpensesDay);
  console.log(chartData);

  return slug === CHARTTYPES.monthlyRemainingBudget ? (
    <RemainingBudget data={chartData} />
  ) : null;
}
