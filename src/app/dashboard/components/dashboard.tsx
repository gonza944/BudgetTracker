"use client";
import { useEffect, useState } from "react";
import { Expense, getExpenses, ProjectBudget } from "../dashboardActions";
import Balance from "./balance";
import DatePicker from "./datePicker";
import ExpensesList from "./expensesList";
import OverallBalance from "./overallBalance";

interface DashboardProps {
  project: ProjectBudget | null;
  expenses: Expense[];
  remainingBudget: number;
  monthlyBudget: number;
  projectName: string;
}

const Dashboard: React.FC<DashboardProps> = ({
  project,
  expenses: initialExpenses,
  remainingBudget: initialRemainingBudget,
  monthlyBudget,
  projectName,
}) => {
  const [selectedDate, setselectedDate] = useState(new Date());
  const [expenses, setexpenses] = useState(initialExpenses);
  const [remainingBudget, setremainingBudget] = useState(
    initialRemainingBudget
  );
  const handleOndateChanged = (date: Date) => {
    setselectedDate(date);
  };

  useEffect(() => {
    (async () => {
      const newExpenses = await getExpenses(
        projectName,
        Number.parseInt(
          `${selectedDate.getFullYear()}${
            selectedDate.getMonth() + 1
          }${selectedDate.getDate()}1`
        ),
        Number.parseInt(
          `${selectedDate.getFullYear()}${selectedDate.getMonth() + 1}${
            selectedDate.getDate() + 1
          }1`
        )
      );
      setexpenses(newExpenses);
      const dailyExpenses = newExpenses.reduce(
        (acc, expense) => acc + expense.amount,
        0
      );
      setremainingBudget(project?.dailyBudget! - dailyExpenses);
    })();
  }, [selectedDate]);

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
        <ExpensesList expenses={expenses} dailyBudget={project?.dailyBudget} />
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
