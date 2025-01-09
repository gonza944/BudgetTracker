"use client";

import { generalContext } from "@/app/providers/context";
import {
  getSelectedExpensesDay,
  getTriggerExpensesReload,
} from "@/app/providers/selectors";
import { use, useEffect, useState } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer
} from "recharts";
import { getSelectedMonthExpensesGroupedByCategory } from "../categoryExpendingChartActions";
import { categoryExpendingChartDataProps } from "../page";

interface ICategoryExpendingChartProps {
  data: categoryExpendingChartDataProps[];
}

export default function CategoryExpendingChart({
  data: initialData,
}: ICategoryExpendingChartProps) {
  const { context, dispatch } = use(generalContext);
  const selectedExpensesDay = getSelectedExpensesDay(context);
  const shouldReloadExpenses = getTriggerExpensesReload(context);
  const [previousDate, setPreviousDate] = useState(selectedExpensesDay);

  useEffect(() => {
    if (shouldReloadExpenses && previousDate !== selectedExpensesDay) {
      (async () => {
        const data = await getSelectedMonthExpensesGroupedByCategory(
          selectedExpensesDay.getMonth()
        );
        setData(data);
        dispatch({ type: "EXPENSES_RELOADED" });
        setPreviousDate(selectedExpensesDay);
      })();
    }
  }, [shouldReloadExpenses]);

  const [data, setData] = useState(initialData);

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
