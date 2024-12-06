import Balance from "./components/balance";
import ExpensesList from "./components/expensesList";
import OverallBalance from "./components/overallBalance";
import { Redis } from "@upstash/redis";

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

const Dashboard: React.FC = async () => {
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

  return (
    <div className=" grid flex-col grid-cols-6 gap-6 max-md:grid-cols-1">
      <div className="flex flex-col items-start max-md:items-center col-start-3 col-span-3 max-md:col-start-1 max-md:col-span-1 row-span-1 flex-wrap">
        <OverallBalance
          budget={project?.budget}
          totalExpenses={project?.total_expenses}
        />
      </div>
      <div className="col-start-3 col-span-3 max-md:col-start-1 max-md:col-span-1 row-span-10 flex justify-between max-md:justify-center">
        <ExpensesList expenses={expenses} dailyBudget={project?.dailyBudget} />
      </div>
      <div className="col-start-2 max-md:col-start-1 col-span-4 max-md:col-span-1 row-span-1 flex justify-between max-md:flex-col max-md:items-center">
        <Balance dailyBudget={project?.dailyBudget} dailyExpenses={dailyExpenses}/>
      </div>
    </div>
  );
};

export default Dashboard;
