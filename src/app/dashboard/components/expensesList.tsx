"use client";
import { useState } from "react";
import { createNewExpense, Expense } from "../dashboardActions";
import AddNewExpenseButton from "./addNewExpenseButton";
import NewExpenseForm from "./newExpenseForm";

interface Expenses {
  expenses: Pick<Expense, "description" | "amount">[];
  dailyBudget?: number;
  selectedDate: Date;
}

const ExpensesList: React.FC<Expenses> = ({ expenses, dailyBudget, selectedDate }) => {
  const [isAddingOrEditing, setIsAddingOrEditing] = useState(false);

  const handleOnAddingNewExpense = async (formData: FormData) => {
    await createNewExpense(formData, selectedDate);
    setIsAddingOrEditing(false);
  };

  return (
    <div className="flex flex-col">
      <div key="dailyBudget" className="flex gap-12 max-sm:gap-6">
        <p className="text-2xl text-neutralBackgroundColorInverted font-paragraph">
          Daily Budget
        </p>
        <p className="font-paragraph text-2xl text-primaryColor">
          ${dailyBudget}
        </p>
      </div>
      {expenses.map((expense, index) => (
        <div key={index} className="flex gap-12 max-sm:gap-6">
          <p className="text-2xl text-neutralBackgroundColorInverted font-paragraph">
            {expense.description}
          </p>
          <p className="font-paragraph text-2xl text-secondaryAccentColor">
            ${expense.amount}
          </p>
        </div>
      ))}
      {!isAddingOrEditing ? (
        <AddNewExpenseButton
          onClick={() => {
            setIsAddingOrEditing(true);
          }}
        />
      ) : (
        <NewExpenseForm onSave={handleOnAddingNewExpense} />
      )}
    </div>
  );
};

export default ExpensesList;
