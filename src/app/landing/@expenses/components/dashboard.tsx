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
import Balance from "./balance";
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
  remainingBudget: initialRemainingBudget,
  monthlyBudget: initialMonthlyBudget,
}) => {
  const { context, dispatch } = use(generalContext);
  const selectedExpensesDay = getSelectedExpensesDay(context);
  const shouldReloadExpenses = getTriggerExpensesReload(context);

  const [previousValue, setpreviousValue] = useState(selectedExpensesDay);
  const [expenses, setexpenses] = useState(initialExpenses);
  const [monthlyBudget, setMonthlyBudget] =
    useState<number>(initialMonthlyBudget);
  const [remainingBudget, setRemainingBudget] = useState<number>(
    initialRemainingBudget
  );
  const fetchNewExpenses = async () => {
    const theFollowingDay = new Date(selectedExpensesDay);
    theFollowingDay.setDate(theFollowingDay.getDate() + 1);
    const selectedDateInScoreFormat = getDateInScoreFormat(selectedExpensesDay);

    const newExpenses = await getExpensesForADay(selectedDateInScoreFormat);
    setexpenses(newExpenses);
    const dailyExpenses = newExpenses.reduce(
      (acc, expense) => acc + Number.parseFloat(expense.amount as string),
      0
    );
    setRemainingBudget(project?.dailyBudget! - dailyExpenses);
    if (
      previousValue.getMonth() !== selectedExpensesDay.getMonth() ||
      !monthlyBudget
    ) {
      const budgetInAMonth = await getMontlyBudget(
        selectedExpensesDay.getMonth()
      );
      setMonthlyBudget(budgetInAMonth);
    }
    setpreviousValue(selectedExpensesDay);
  };

  useEffect(() => {
    if (shouldReloadExpenses) {
      fetchNewExpenses();
      dispatch({ type: "EXPENSES_RELOADED" });
    }
  }, [shouldReloadExpenses]);

  return (
    <div className=" grid flex-col grid-cols-6 gap-6 max-md:grid-cols-1">
      <div className="col-start-3 col-span-3 max-md:col-start-1 max-md:col-span-1 row-span-10 flex justify-between max-md:justify-center">
        <ExpensesList
          expenses={expenses}
          dailyBudget={project?.dailyBudget}
          selectedDate={selectedExpensesDay}
        />
      </div>
      <div className="col-start-2 max-md:col-start-1 col-span-4 max-md:col-span-1 row-span-1 flex justify-between max-md:flex-col max-md:items-center">
        <Balance
          remainingBudget={remainingBudget}
          monthlyBudget={monthlyBudget}
        />
      </div>
    </div>
  );
};

export default Dashboard;
