import LoadingSpinner from "@/utils/loadingSpinner";
import {
  getExpensesForADay,
  getProject,
  monthlyBudget,
} from "../@expenses/dashboardActions";
import { initialState } from "@/app/providers/generalReducer";
import { getDateInScoreFormat } from "../utils";

const remainingMonthlyBudget = await monthlyBudget(
  initialState.selectedExpensesDay.getMonth()
);
const project = await getProject(initialState.currentProject);
const expenses = await getExpensesForADay(
  getDateInScoreFormat(initialState.selectedExpensesDay)
);
const dailyExpenses = expenses.reduce(
  (acc, expense) => acc + Number.parseFloat(expense.amount as string),
  0
);

const remainingBudget = project?.dailyBudget! - dailyExpenses;
const totalBalance = project ? project?.budget - project?.total_expenses : 0;

const Balance: React.FC = () => {
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
