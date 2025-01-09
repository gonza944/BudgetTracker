import { initialState } from "@/app/providers/generalReducer";
import { getSelectedMonthExpensesGroupedByCategory } from "./categoryExpendingChartActions";
import CategoryExpendingChart from "./components/categoryExpendingChart";

export interface categoryExpendingChartDataProps {
  name: string;
  amount: number;
}


export default async function Page() {
  
  const chartData = await getSelectedMonthExpensesGroupedByCategory(
    initialState.selectedExpensesDay.getMonth()
  );

  return <CategoryExpendingChart data={chartData} />;
}
