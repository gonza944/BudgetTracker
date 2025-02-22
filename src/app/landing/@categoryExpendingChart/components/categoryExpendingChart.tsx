"use client";

import { getSelectedMonthExpensesGroupedByCategory, useProjectStore } from "@/app/store/projectStore";
import {
  Pie,
  PieChart,
  ResponsiveContainer
} from "recharts";

export default function CategoryExpendingChart() {
  const data = useProjectStore(getSelectedMonthExpensesGroupedByCategory)
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          nameKey="name"
          label
          dataKey="amount">
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
