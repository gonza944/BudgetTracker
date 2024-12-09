import Dashboard from "./components/dashboard";
import { getExpenses, getProject, monthlyBudget } from "./dashboardActions";

export const PROJECTNAME = "project:viaje-europa-2024";

const DashboardPage: React.FC = async () => {
  const project = await getProject(PROJECTNAME);
  const expenses = await getExpenses(
    `${PROJECTNAME}:expenses`,
    20241261,
    20241271
  );
  const budgetInAMonth = await monthlyBudget(project!, 20241261, 20250161);

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
