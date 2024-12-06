import { Redis } from "@upstash/redis";
import { Expense } from "../page";

interface BalanceProps {
  dailyBudget?: number;
  dailyExpenses?: number;
}

const Balance: React.FC<BalanceProps> = async ({
  dailyBudget,
  dailyExpenses,
}) => {
  const remainingBudget = dailyBudget! - dailyExpenses!;

  const redis = Redis.fromEnv();
  const expensesIndexes: string[] = await redis.zrange(
    "project:viaje-europa-2024:expenses",
    20241261,
    20250161,
    { byScore: true }
  );

  const montlyBudget: number = await Promise.all(
    expensesIndexes.map(
      (name) => redis.hgetall(name) as Promise<Expense | null>
    )
  )
    .then(
      (expenses) => expenses.filter((expense) => expense !== null) as Expense[]
    )
    .then((expensesNotNull) =>
      expensesNotNull.reduce((acc, expense) => acc + expense.amount, 0)
    )
    .then((totalExpenses) => dailyBudget! * 30 - totalExpenses);

  return (
    <>
      <div className="flex gap-4 max-sm:gap-4">
        <p className="text-2xl text-neutralBackgroundColorInverted font-paragraph">
          Daily Balance
        </p>
        <p className="font-paragraph text-2xl text-primaryColor">
          ${remainingBudget}
        </p>
      </div>
      <div className="flex gap-4 max-sm:gap-4">
        <p className="text-2xl text-neutralBackgroundColorInverted font-paragraph">
          Monthly Balance
        </p>
        <p className="font-paragraph text-2xl text-primaryColor">
          ${montlyBudget}
        </p>
      </div>
    </>
  );
};

export default Balance;
