import Dashboard from "./components/dashboard";
import { getExpenses, getProject, monthlyBudget } from "./dashboardActions";
import {
  FIRSTEXPENSE,
  getDateInScoreFormat,
  getFirstDayOfTheFollowingMonthInScoreFormat,
  getFirstDayOfTheMonthInScoreFormat,
} from "./utils";

export const PROJECTNAME = "project:viaje-europa-2024";

const DashboardPage: React.FC = async () => {
  const today = new Date();
  const project = await getProject(PROJECTNAME);
  const theFollowingDay = new Date(today);
  theFollowingDay.setDate(theFollowingDay.getDate() + 1);
  const selectedDateInScoreFormat = getDateInScoreFormat(today);
  const theFollowingDayInScoreFormat = getDateInScoreFormat(today);
  const selectedDateFirstDayOfTheMonth =
    getFirstDayOfTheMonthInScoreFormat(today);
  const selectedDateFirstDayOfTheFollowingMonth =
    getFirstDayOfTheFollowingMonthInScoreFormat(today);

  const expenses = await getExpenses(
    `${PROJECTNAME}:expenses`,
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
      projectName={`${PROJECTNAME}:expenses`}
    />
  );
};

export default DashboardPage;
