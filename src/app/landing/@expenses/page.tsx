import { initialState } from "@/app/providers/generalReducer";
import {
  FIRSTEXPENSE,
  getDateInScoreFormat,
  getDateInScoreFormatWithoutExpenseNumber,
} from "../utils";
import Dashboard from "./components/dashboard";
import {
  getExpenses,
  getExpensesForADay,
  getProject,
  monthlyBudget,
} from "./dashboardActions";

const DashboardPage: React.FC = async () => {
  const project = await getProject(initialState.currentProject);
  const theFollowingDay = new Date(initialState.selectedExpensesDay);
  theFollowingDay.setDate(theFollowingDay.getDate() + 1);
  const selectedDateInScoreFormat = getDateInScoreFormat(
    initialState.selectedExpensesDay
  );
 
  const expenses = await getExpensesForADay(selectedDateInScoreFormat);
  const budgetInAMonth = await monthlyBudget(
    initialState.selectedExpensesDay.getMonth()
  );

  const dailyExpenses = expenses.reduce(
    (acc, expense) => acc + Number.parseFloat(expense.amount as string),
    0
  );

  return (
    <Dashboard
      project={project}
      expenses={expenses}
      monthlyBudget={budgetInAMonth}
      remainingBudget={project?.dailyBudget! - dailyExpenses}
    />
  );
};

export default DashboardPage;
