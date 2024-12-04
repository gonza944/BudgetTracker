const Dashboard: React.FC = () => {
  return (
    <div className=" grid flex-col grid-cols-6 grid-rows-6 gap-6">
      <div className="flex flex-col items-center col-start-3 col-span-3 row-span-1">
        <h1 className="font-title text-5xl">Overall Balance</h1>
        <h2 className="font-title text-7xl text-primaryColor m-4">$ 500</h2>
      </div>

      <div className="flex flex-col col-start-3 col-span-2 row-start-2 row-span-3">
        <div className="flex gap-12">
          <div className="flexflex-col items-start">
            <p className="text-2xl text-neutralBackgroundColorInverted font-paragraph">
              Budget
            </p>
          </div>
        </div>

        <div className="flex gap-12">
          <div className="flex  items-start">
            <p className="text-2xl text-neutralBackgroundColorInverted font-paragraph">
              Pizza in the restaurant
            </p>
          </div>
        </div>

        <div className="flex gap-12">
          <div className="flex  items-start">
            <p className="text-2xl text-neutralBackgroundColorInverted font-paragraph">
              coffee
            </p>
          </div>
        </div>

        <div className="flex gap-12">
          <div className="flex  items-start">
            <p className="text-2xl text-neutralBackgroundColorInverted font-paragraph">
              supermarket
            </p>
          </div>
        </div>
      </div>

      <div className="col-start-5 row-start-2">
        <div className="flex items-start">
          <p className="font-paragraph text-2xl text-primaryColor">$120</p>
        </div>
        <div className="flex  items-start">
          <p className="font-paragraph text-2xl text-secondaryAccentColor">
            $30
          </p>
        </div>

        <div className="flex  items-start">
          <p className="font-paragraph text-2xl text-secondaryAccentColor">
            $10
          </p>
        </div>
        <div className="flex  items-start">
          <p className="font-paragraph text-2xl text-secondaryAccentColor">
            $70
          </p>
        </div>
      </div>

      <div className="col-start-3 col-span-2 row-start-5 flex">
        <div className="flex items-start mt-4">
          <p className="text-2xl text-neutralBackgroundColorInverted font-paragraph">
            Daily Balance
          </p>
        </div>
      </div>
      <div className="flex col-start-5 row-start-5 items-start mt-4">
        <p className="font-paragraph text-2xl text-primaryColor">$10</p>
      </div>
    </div>
  );
};

export default Dashboard;
