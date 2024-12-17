"use client";

import { generalContext } from "@/app/providers/context";
import {
  getSelectedExpensesDay,
  getTriggerExpensesReload,
} from "@/app/providers/selectors";
import { use, useEffect, useState } from "react";
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
import { getSelectedMonthExpensesGroupedByDay } from "../chartsActions";

export interface RemainingBudgetChartDataProps {
  name: string;
  remainingBudget?: number;
  controlBudget?: number;
  date?: Date;
}

interface IRemainingBudgetProps {
  data: RemainingBudgetChartDataProps[];
}

export default function RemainingBudget({
  data: initialData,
}: IRemainingBudgetProps) {
  const { context, dispatch } = use(generalContext);
  const selectedExpensesDay = getSelectedExpensesDay(context);
  const shouldReloadExpenses = getTriggerExpensesReload(context);
  const [previousDate, setPreviousDate] = useState(selectedExpensesDay);

  useEffect(() => {
    if (shouldReloadExpenses && previousDate !== selectedExpensesDay) {
      (async () => {
        const data = await getSelectedMonthExpensesGroupedByDay(
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
              x: data[data.length - 1].name,
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
