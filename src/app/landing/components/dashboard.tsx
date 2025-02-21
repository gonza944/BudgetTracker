"use client";

import { dailyRemainingBudget, useProjectStore } from "@/app/store/projectStore";

import Balance from "./balance";
import ExpensesList from "./expensesList";

const Dashboard: React.FC = ({
}) => {
  const budget = useProjectStore(dailyRemainingBudget);


  return (
    <div className=" grid flex-col grid-cols-6 gap-6 max-md:grid-cols-1">
      <div className="col-start-3 col-span-3 max-md:col-start-1 max-md:col-span-1 row-span-10 flex justify-between max-md:justify-center">
        <ExpensesList
        />
      </div>
      <div className="col-start-2 max-md:col-start-1 col-span-4 max-md:col-span-1 row-span-1 flex justify-between max-md:flex-col max-md:items-center">
        <Balance
          remainingBudget={budget}
          monthlyBudget={budget}
        />
      </div>
    </div>
  );
};

export default Dashboard;
