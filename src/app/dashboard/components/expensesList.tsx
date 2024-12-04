const ExpensesList: React.FC = () => {
  return (
    <div className="">
      {[
        { name: "Budget", price: "$30" },
        { name: "Pizza in a restaurant", price: "$50" },
        { name: "supermarket", price: "$10" },
      ].map((expense, index) => (
        <div key={index} className="flex gap-12 max-sm:gap-6">
          <p className="text-2xl text-neutralBackgroundColorInverted font-paragraph">
            {expense.name}
          </p>
          <p className="font-paragraph text-2xl text-secondaryAccentColor">
            {expense.price}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ExpensesList;
