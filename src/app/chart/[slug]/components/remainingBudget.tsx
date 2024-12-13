"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface RemainingBudgetChartDataProps {
  name: string;
  remainingBudget: number;
  controlBudget?: number;
  date?: Date;
}

interface IRemainingBudgetProps {
  data: RemainingBudgetChartDataProps[];
}

export default function RemainingBudget({ data }: IRemainingBudgetProps) {
  /* const { context, dispatch } = use(generalContext);
    const selectedExpensesDay = getSelectedExpensesDay(context);
    const shouldReloadExpenses = getTriggerExpensesReload(context); */

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
        <Legend />
        <Line type="monotone" dataKey="remainingBudget" stroke="#828c77" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
