"use client";
import { Expense, ProjectBudget } from "../page";
import Balance from "./balance";
import DatePicker from "./datePicker";
import ExpensesList from "./expensesList";
import OverallBalance from "./overallBalance";

interface DashboardProps {
  project: ProjectBudget | null;
  expenses: Expense[];
  remainingBudget: number;
  montlyBudget: number;
}

const Dashboard: React.FC<DashboardProps> = ({
  project,
  expenses,
  remainingBudget,
  montlyBudget,
}) => {
  return (
    <div className=" grid flex-col grid-cols-6 gap-6 max-md:grid-cols-1">
      <div className=" col-start-1 col-span-6 max-md:col-start-1 max-md:col-span-1 row-span-1 flex justify-center max-md:justify-center">
        <DatePicker onDateChanged={() => {}} />
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
          montlyBudget={montlyBudget}
        />
      </div>
    </div>
  );
};

export default Dashboard;
