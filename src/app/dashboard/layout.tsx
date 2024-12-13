export default function Layout({
  children,
  charts,
  expenses,
}: {
  children: React.ReactNode;
  expenses: React.ReactNode;
  charts: React.ReactNode;
}) {
  return (
    <div className=" grid grid-cols-4 gap-6 max-md:grid-cols-1">
      <div className="col-start-1 col-span-2 max-md:col-start-1 max-md:col-span-1">
        {charts}
      </div>
      <div className="col-start-3 col-span-2 max-md:col-start-1 max-md:col-span-1">
        {expenses}
      </div>
    </div>
  );
}
