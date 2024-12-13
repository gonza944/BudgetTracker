import { initialState } from "@/app/providers/generalReducer";
import { getSelectedMonthExpensesGroupedByDay } from "./chartsActions";
import RemainingBudget, {
  RemainingBudgetChartDataProps,
} from "./components/remainingBudget";

export const CHARTTYPES = {
  monthlyRemainingBudget: "monthlyRemainingBudget",
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const chartData = await getSelectedMonthExpensesGroupedByDay(initialState.selectedExpensesDay);

  return slug === CHARTTYPES.monthlyRemainingBudget ? (
    <RemainingBudget data={chartData} />
  ) : null;
}
