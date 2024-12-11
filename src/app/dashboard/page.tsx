import { initialState } from "../providers/generalReducer";
import Dashboard from "./components/dashboard";
import { getExpenses, getProject, monthlyBudget } from "./dashboardActions";
import {
  FIRSTEXPENSE,
  getDateInScoreFormat,
  getFirstDayOfTheFollowingMonthInScoreFormat,
  getFirstDayOfTheMonthInScoreFormat,
} from "./utils";

const DashboardPage: React.FC = async () => {
  const project = await getProject(initialState.currentProject);
  const theFollowingDay = new Date(initialState.selectedExpensesDay);
  theFollowingDay.setDate(theFollowingDay.getDate() + 1);
  const selectedDateInScoreFormat = getDateInScoreFormat(initialState.selectedExpensesDay);
  const theFollowingDayInScoreFormat = getDateInScoreFormat(theFollowingDay);
  const selectedDateFirstDayOfTheMonth =
    getFirstDayOfTheMonthInScoreFormat(initialState.selectedExpensesDay);
  const selectedDateFirstDayOfTheFollowingMonth =
    getFirstDayOfTheFollowingMonthInScoreFormat(initialState.selectedExpensesDay);

  const expenses = await getExpenses(
    `${initialState.currentProject}:expenses`,
    Number.parseInt(`${selectedDateInScoreFormat}${FIRSTEXPENSE}`),
    Number.parseInt(`${theFollowingDayInScoreFormat}${FIRSTEXPENSE}`)
  );
  const budgetInAMonth = await monthlyBudget(
    project!,
    selectedDateFirstDayOfTheMonth,
    selectedDateFirstDayOfTheFollowingMonth
  );

  const dailyExpenses = expenses.reduce(
    (acc, expense) => acc + expense.amount,
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
