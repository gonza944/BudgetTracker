import { Redis } from "@upstash/redis";

interface OverallBalanceProps {
  budget?: number;
  totalExpenses?: number;
}

const OverallBalance: React.FC<OverallBalanceProps> = ({
  budget,
  totalExpenses,
}) => {
  if (!budget || !totalExpenses) {
    return null;
  }
  const remainingBudget = budget - totalExpenses;

  return (
    <>
      <h1 className="font-title text-5xl">Overall Balance</h1>
      <h2
        className={`font-title text-7xl ${
          remainingBudget >= 0
            ? "text-primaryColor"
            : "text-secondaryAccentColor"
        } m-4`}>
        $ {remainingBudget}
      </h2>
    </>
  );
};

export default OverallBalance;
