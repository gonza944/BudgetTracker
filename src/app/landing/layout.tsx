export default function Layout({
  header,
  charts,
  children,
  datePicker,
  balance,
}: {
  header: React.ReactNode;
  children: React.ReactNode;
  charts: React.ReactNode;
  datePicker: React.ReactNode;
  balance: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-[100%]">
      {header}
      <div className="mb-6 overflow-x-auto no-scrollbar">{datePicker}</div>
      <div className="grid grid-cols-4 grid-rows-4 gap-8 max-md:grid-cols-1 grow">
        <div className="col-start-1 row-span-4 col-span-2 max-md:hidden">
          {charts}
        </div>
        <div className="col-start-3 row-start-1 col-span-1 row-span-1">{balance}</div>
        <div className="col-start-4 col-span-1 row-start-2 row-span-3 max-md:col-start-1 max-md:col-span-1">
          {children}
        </div>
      </div>
    </div>
  );
}
