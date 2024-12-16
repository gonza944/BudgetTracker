import { initialState } from "@/app/providers/generalReducer";
import { getSelectedMonthExpensesGroupedByDay } from "./chartsActions";
import RemainingBudget from "./components/remainingBudget";

export const CHARTTYPES = {
  monthlyRemainingBudget: "monthlyRemainingBudget",
};

export default async function Page() {
  const chartData = await getSelectedMonthExpensesGroupedByDay(
    initialState.selectedExpensesDay
  );

  return <RemainingBudget data={chartData} />;
}
