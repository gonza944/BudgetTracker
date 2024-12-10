import { Expense } from "../dashboardActions";

interface Expenses {
  expenses: Pick<Expense, "description" | "amount">[];
  dailyBudget?: number;
}

const ExpensesList: React.FC<Expenses> = ({ expenses, dailyBudget }) => {
  return (
    <div className="">
      <div key="dailyBudget" className="flex gap-12 max-sm:gap-6">
        <p className="text-2xl text-neutralBackgroundColorInverted font-paragraph">
          Daily Budget
        </p>
        <p className="font-paragraph text-2xl text-primaryColor">
          ${dailyBudget}
        </p>
      </div>
      {expenses.map((expense, index) => (
        <div key={index} className="flex gap-12 max-sm:gap-6">
          <p className="text-2xl text-neutralBackgroundColorInverted font-paragraph">
            {expense.description}
          </p>
          <p className="font-paragraph text-2xl text-secondaryAccentColor">
            ${expense.amount}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ExpensesList;
