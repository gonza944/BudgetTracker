import LoadingSpinner from "@/utils/loadingSpinner";

interface BalanceProps {
  remainingBudget?: number;
  monthlyBudget?: number;
}

const Balance: React.FC<BalanceProps> = ({
  remainingBudget,
  monthlyBudget,
}) => {
  return (
    <>
      <div className="flex gap-4 max-sm:gap-4">
        <p className="text-2xl text-neutralBackgroundColorInverted font-paragraph">
          Daily Balance
        </p>
        {remainingBudget ? (
          <p
            className={`font-paragraph text-2xl ${
              remainingBudget > 0
                ? "text-primaryColor"
                : "text-secondaryAccentColor"
            }`}>
            ${remainingBudget}
          </p>
        ) : (
          <LoadingSpinner />
        )}
      </div>
      <div className="flex gap-4 max-sm:gap-4">
        <p className="text-2xl text-neutralBackgroundColorInverted font-paragraph">
          Monthly Balance
        </p>
        {monthlyBudget ? (
          <p className="font-paragraph text-2xl text-primaryColor">
            ${monthlyBudget}
          </p>
        ) : (
          <LoadingSpinner />
        )}
      </div>
    </>
  );
};

export default Balance;
