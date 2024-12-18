import { initialState } from "@/app/providers/generalReducer";
import {
  getExpensesForADay,
  getProject,
  monthlyBudget,
} from "../@expenses/dashboardActions";
import { getDateInScoreFormat } from "../utils";
import Balance from "./components/Balance";

const BalancePage: React.FC = async () => {
  async function fetchData(selectedDay: Date, currentProject: string) {
    const remainingMonthlyBudget = await monthlyBudget(selectedDay.getMonth());
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
    return { totalBalance, remainingBudget, remainingMonthlyBudget };
  }

  const { totalBalance, remainingBudget, remainingMonthlyBudget } =
    await fetchData(
      initialState.selectedExpensesDay,
      initialState.currentProject
    );

  return (
    <Balance
      totalBalance={totalBalance}
      remainingBudget={remainingBudget}
      remainingMonthlyBudget={remainingMonthlyBudget}
    />
  );
};

export default BalancePage;
