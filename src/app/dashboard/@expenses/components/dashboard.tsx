"use client";
import { generalContext } from "@/app/providers/context";
import { initialState } from "@/app/providers/generalReducer";
import { getSelectedExpensesDay, getTriggerExpensesReload } from "@/app/providers/selectors";
import { use, useEffect, useState } from "react";

import { FIRSTEXPENSE, getDateInScoreFormat, getFirstDayOfTheFollowingMonthInScoreFormat, getFirstDayOfTheMonthInScoreFormat } from "../../utils";
import { Expense, getExpenses, ProjectBudget, monthlyBudget as getMontlyBudget } from "../dashboardActions";
import Balance from "./balance";
import DatePicker from "./datePicker";
import ExpensesList from "./expensesList";
import OverallBalance from "./overallBalance";
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
  const [monthlyBudget, setmonthlyBudget] =
    useState<number>(initialMonthlyBudget);
  const [remainingBudget, setremainingBudget] = useState<number>(
    initialRemainingBudget
  );

  const handleOndateChanged = (date: Date) => {
    dispatch({ type: "SET_SELECTED_EXPENSES_DAY", payload: date });
  };

  const fetchNewExpenses = async () => {
    const theFollowingDay = new Date(selectedExpensesDay);
    theFollowingDay.setDate(theFollowingDay.getDate() + 1);
    const selectedDateInScoreFormat = getDateInScoreFormat(selectedExpensesDay);
    const theFollowingDayInScoreFormat = getDateInScoreFormat(theFollowingDay);
    const selectedDateFirstDayOfTheMonth =
      getFirstDayOfTheMonthInScoreFormat(selectedExpensesDay);
    const selectedDateFirstDayOfTheFollowingMonth =
      getFirstDayOfTheFollowingMonthInScoreFormat(selectedExpensesDay);

    const newExpenses = await getExpenses(
      `${initialState.currentProject}:expenses`,
      Number.parseInt(`${selectedDateInScoreFormat}${FIRSTEXPENSE}`),
      Number.parseInt(`${theFollowingDayInScoreFormat}${FIRSTEXPENSE}`)
    );
    setexpenses(newExpenses);
    const dailyExpenses = newExpenses.reduce(
      (acc, expense) => acc + expense.amount,
      0
    );
    setremainingBudget(project?.dailyBudget! - dailyExpenses);
    if (
      previousValue.getMonth() !== selectedExpensesDay.getMonth() ||
      !monthlyBudget
    ) {
      const budgetInAMonth = await getMontlyBudget(
        project!,
        selectedDateFirstDayOfTheMonth,
        selectedDateFirstDayOfTheFollowingMonth
      );
      setmonthlyBudget(budgetInAMonth);
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
      <div className=" col-start-1 col-span-6 max-md:col-start-1 max-md:col-span-1 row-span-1 flex justify-center max-md:justify-center">
        <DatePicker onDateChanged={handleOndateChanged} />
      </div>
      <div className="flex flex-col items-start max-md:items-center col-start-3 col-span-3 max-md:col-start-1 max-md:col-span-1 row-span-1 flex-wrap">
        <OverallBalance
          budget={project?.budget}
          totalExpenses={project?.total_expenses}
        />
      </div>
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
