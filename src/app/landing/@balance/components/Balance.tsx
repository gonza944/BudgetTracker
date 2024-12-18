"use client";

import { generalContext } from "@/app/providers/context";
import { initialState } from "@/app/providers/generalReducer";
import {
  getSelectedExpensesDay,
  getTriggerExpensesReload,
} from "@/app/providers/selectors";
import LoadingSpinner from "@/utils/loadingSpinner";
import { use, useEffect, useState } from "react";
import {
  monthlyBudget,
  getProject,
  getExpensesForADay,
} from "../../@expenses/dashboardActions";
import { getDateInScoreFormat } from "../../utils";

interface BalanceProps {
  remainingBudget: number;
  remainingMonthlyBudget: number;
  totalBalance: number;
}

const Balance: React.FC<BalanceProps> = ({
  remainingBudget: initialRemainingBudget,
  remainingMonthlyBudget: initialRemainingMonthlyBudget,
  totalBalance: initialTotalBalance,
}) => {
  const [remainingBudget, setRemainingBudget] = useState(
    initialRemainingBudget
  );
  const [remainingMonthlyBudget, setRemainingMonthlyBudget] = useState(
    initialRemainingMonthlyBudget
  );
  const [totalBalance, setTotalBalance] = useState(initialTotalBalance);
  const [previousDate, setPreviousDate] = useState(initialState.selectedExpensesDay);
  const { context } = use(generalContext);
  const selectedExpensesDay = getSelectedExpensesDay(context);
  const shouldReloadExpenses = getTriggerExpensesReload(context);

  useEffect(() => {
    const fetchNewData = async function fetchData(
      selectedDay: Date,
      currentProject: string
    ) {
      const newRemainingMonthlyBudget = previousDate.getMonth() !== selectedDay.getMonth()? await monthlyBudget(
        selectedDay.getMonth()
      ) : remainingMonthlyBudget;
      const project = await getProject(currentProject);
      const expenses = await getExpensesForADay(
        getDateInScoreFormat(selectedDay)
      );
      const dailyExpenses = expenses.reduce(
        (acc, expense) => acc + Number.parseFloat(expense.amount as string),
        0
      );

      const remainingBudget = project?.dailyBudget! - dailyExpenses;
      const totalBalance = project
        ? project?.budget - project?.total_expenses
        : 0;
      return { totalBalance, remainingBudget, newRemainingMonthlyBudget };
    };
    if (shouldReloadExpenses) {
      fetchNewData(
        selectedExpensesDay,
        initialState.currentProject
      ).then(({ totalBalance, remainingBudget, newRemainingMonthlyBudget }) => {
        setTotalBalance(totalBalance);
        setRemainingBudget(remainingBudget);
        setRemainingMonthlyBudget(newRemainingMonthlyBudget);
      });
    }
  }, [shouldReloadExpenses]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full items-stretch justify-between">
        <p className="text-lg leading-tight font-bold text-textColor font-paragraph">
          Daily Balance
        </p>
        {remainingBudget ? (
          <p
            className={`font-paragraph text-lg leading-tight font-bold ${
              remainingBudget > 0
                ? "text-primaryColor"
                : "text-secondaryAccentColor"
            }`}>
            ${remainingBudget.toFixed(2)}
          </p>
        ) : (
          <LoadingSpinner />
        )}
      </div>
      <div className="flex w-full items-stretch justify-between">
        <p className="text-lg leading-tight font-bold text-textColor font-paragraph">
          Monthly Balance
        </p>
        {remainingMonthlyBudget ? (
          <p
            className={`font-paragraph text-lg leading-tight font-bold ${
              remainingMonthlyBudget > 0
                ? "text-primaryColor"
                : "text-secondaryAccentColor"
            }`}>
            ${remainingMonthlyBudget.toFixed(2)}
          </p>
        ) : (
          <LoadingSpinner />
        )}
      </div>
      <div className="flex w-full items-stretch justify-between">
        <p className="text-lg leading-tight font-bold text-textColor font-paragraph">
          Total Balance
        </p>
        {totalBalance ? (
          <p
            className={`font-paragraph text-lg leading-tight font-bold ${
              totalBalance > 0
                ? "text-primaryColor"
                : "text-secondaryAccentColor"
            }`}>
            ${totalBalance.toFixed(2)}
          </p>
        ) : (
          <LoadingSpinner />
        )}
      </div>
    </div>
  );
};

export default Balance;
