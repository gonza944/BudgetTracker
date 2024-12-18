"use client";
import { generalContext } from "@/app/providers/context";
import {
  getSelectedExpensesDay,
  getTriggerExpensesReload,
} from "@/app/providers/selectors";
import { use, useEffect, useState } from "react";

import {
  getDateInScoreFormat
} from "../../utils";
import {
  Expense,
  getExpensesForADay,
  monthlyBudget as getMontlyBudget,
  ProjectBudget
} from "../dashboardActions";
import ExpensesList from "./expensesList";
interface DashboardProps {
  project: ProjectBudget | null;
  expenses: Expense[];
  remainingBudget: number;
  monthlyBudget: number;
}

const Dashboard: React.FC<DashboardProps> = ({
  project,
  expenses: initialExpenses,
  monthlyBudget: initialMonthlyBudget,
}) => {
  const { context, dispatch } = use(generalContext);
  const selectedExpensesDay = getSelectedExpensesDay(context);
  const shouldReloadExpenses = getTriggerExpensesReload(context);

  const [expenses, setexpenses] = useState(initialExpenses);
    useState<number>(initialMonthlyBudget);
  const fetchNewExpenses = async () => {
    const theFollowingDay = new Date(selectedExpensesDay);
    theFollowingDay.setDate(theFollowingDay.getDate() + 1);
    const selectedDateInScoreFormat = getDateInScoreFormat(selectedExpensesDay);

    const newExpenses = await getExpensesForADay(selectedDateInScoreFormat);
    setexpenses(newExpenses);
  };

  useEffect(() => {
    if (shouldReloadExpenses) {
      fetchNewExpenses();
      dispatch({ type: "EXPENSES_RELOADED" });
    }
  }, [shouldReloadExpenses]);

  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <ExpensesList
          expenses={expenses}
          dailyBudget={project?.dailyBudget}
          selectedDate={selectedExpensesDay}
        />
      </div>
    </div>
  );
};

export default Dashboard;
