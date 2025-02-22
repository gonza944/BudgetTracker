"use client";

import { getSelectedMonthExpensesGroupedByDay, useProjectStore } from "@/app/store/projectStore";
import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface RemainingBudgetChartDataProps {
  name: string;
  remainingBudget?: number;
  controlBudget?: number;
  date?: Date;
}

export default function RemainingBudget() {
  const state = useProjectStore();
  const data = useMemo(() => getSelectedMonthExpensesGroupedByDay(state), [state]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <ReferenceLine
          stroke="#f2a444"
          strokeDasharray="3 3"
          segment={[
            { x: "", y: data[0].controlBudget },
            {
              x: data[getSelectedMonthExpensesGroupedByDay.length - 1].name,
              y: 0,
            },
          ]}
        />
        <Line
          type="monotone"
          dataKey="remainingBudget"
          stroke="#828c77"
          strokeWidth={2}
          connectNulls
          name="Remaining Budget"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
