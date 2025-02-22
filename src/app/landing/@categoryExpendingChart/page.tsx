import CategoryExpendingChart from "./components/categoryExpendingChart";

export interface categoryExpendingChartDataProps {
  name: string;
  amount: number;
}


export default async function Page() {
  return <CategoryExpendingChart />;
}
