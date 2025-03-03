"use client";
import { getExpensesForADay, useProjectStore } from "@/app/store/projectStore";
import { Button } from "@headlessui/react";
import { useState } from "react";
import AddNewExpenseButton from "./addNewExpenseButton";
import NewExpenseForm from "./newExpenseForm";



const ExpensesList: React.FC = ({
}) => {
  const state = useProjectStore();
  const { removeExpense, projectName, createNewExpense, project, selectedExpensesDay: selectedDate } = state;
  const expenses = getExpensesForADay(state);

  const { dailyBudget } = project;

  const [isAddingOrEditing, setIsAddingOrEditing] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<number | null>(null);

  const handleOnExpenseClick = (index: number) => () => {
    if (selectedExpense === index) {
      setSelectedExpense(null);
    } else {
      setSelectedExpense(index);
    }
  };
  const handleRemoveExpense = (index: number) => async () => {
    removeExpense(projectName, expenses[index]);
  };

  const handleOnAddingNewExpense = async (formData: FormData) => {
    createNewExpense(formData, selectedDate, projectName);
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
        <div
          key={index}
          className={`flex gap-12 max-sm:gap-6 ${selectedExpense === index
            ? "rounded-lg border-2 border-neutralBackgroundColorInverted"
            : ""
            }`}>
          <Button
            onClick={handleOnExpenseClick(index)}
            className={"flex gap-12 max-sm:gap-6"}>
            <p className="text-2xl text-neutralBackgroundColorInverted font-paragraph">
              {expense.description}
            </p>
            <p className="font-paragraph text-2xl text-secondaryAccentColor">
              ${expense.amount}
            </p>
          </Button>
          {selectedExpense === index && (
            <Button onClick={handleRemoveExpense(index)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-8 stroke-neutralBackgroundColorInverted">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </Button>
          )}
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
