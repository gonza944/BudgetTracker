import { Redis } from "@upstash/redis";
import Dashboard from "./components/dashboard";

export interface Expense {
  category: string;
  description: string;
  amount: number;
}

export interface ProjectBudget {
  budget: number;
  total_expenses: number;
  dailyBudget: number;
}

const DashboardPage: React.FC = async () => {
  const redis = Redis.fromEnv();

  const project = (await redis.hmget(
    "project:viaje-europa-2024",
    "budget",
    "dailyBudget",
    "total_expenses"
  )) as ProjectBudget | null;

  const expensesIndexes: string[] = await redis.zrange(
    "project:viaje-europa-2024:expenses",
    20241261,
    20241271,
    { byScore: true }
  );

  const expenses: Array<Expense> = await Promise.all(
    expensesIndexes.map(
      (name) => redis.hgetall(name) as Promise<Expense | null>
    )
  ).then(
    (expenses) => expenses.filter((expense) => expense !== null) as Expense[]
  );

  const dailyExpenses = expenses.reduce(
    (acc, expense) => acc + expense.amount,
    0
  );

  const montlyExpensesIndexes: string[] = await redis.zrange(
    "project:viaje-europa-2024:expenses",
    20241261,
    20250161,
    { byScore: true }
  );

  const montlyBudget: number = await Promise.all(
    montlyExpensesIndexes.map(
      (name) => redis.hgetall(name) as Promise<Expense | null>
    )
  )
    .then(
      (expenses) => expenses.filter((expense) => expense !== null) as Expense[]
    )
    .then((expensesNotNull) =>
      expensesNotNull.reduce((acc, expense) => acc + expense.amount, 0)
    )
    .then((totalExpenses) => project?.dailyBudget! * 30 - totalExpenses);

  return (
    <Dashboard
      project={project}
      expenses={expenses}
      montlyBudget={montlyBudget}
      remainingBudget={project?.dailyBudget! - dailyExpenses}
    />
  );
};

export default DashboardPage;
