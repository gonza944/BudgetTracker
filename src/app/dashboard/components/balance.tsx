const Balance: React.FC = () => {
  return (
    <>
      <div className="flex gap-4">
        <p className="text-2xl text-neutralBackgroundColorInverted font-paragraph">
          Daily Balance
        </p>
        <p className="font-paragraph text-2xl text-primaryColor">$10</p>
      </div>
      <div className="flex gap-4">
        <p className="text-2xl text-neutralBackgroundColorInverted font-paragraph">
          Monthly Balance
        </p>
        <p className="font-paragraph text-2xl text-primaryColor">$170</p>
      </div>
    </>
  );
};

export default Balance;
