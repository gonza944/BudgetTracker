import { Redis } from "@upstash/redis";
import { Expense } from "../page";

interface BalanceProps {
  remainingBudget: number;
  montlyBudget: number;
}

const Balance: React.FC<BalanceProps> = ({ remainingBudget, montlyBudget }) => {
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
