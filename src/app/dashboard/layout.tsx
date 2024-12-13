export default function Layout({
  header,
  charts,
  expenses,
  datePicker,
}: {
  header: React.ReactNode;
  expenses: React.ReactNode;
  charts: React.ReactNode;
  datePicker: React.ReactNode;
}) {
  return (
    <div className=" grid grid-cols-4 gap-6 max-md:grid-cols-1">
      <div className="row-span-1 col-span-4 items-center overflow-x-auto no-scrollbar">
        {datePicker}
      </div>
      <div className="row-span-1 col-span-4 items-center">
        {header}
      </div>
      <div className="col-start-1 col-span-2 max-md:col-start-1 max-md:col-span-1">
        {charts}
      </div>
      <div className="col-start-3 col-span-2 max-md:col-start-1 max-md:col-span-1">
        {expenses}
      </div>
    </div>
  );
}
