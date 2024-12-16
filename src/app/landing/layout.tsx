export default function Layout({
  header,
  charts,
  children,
  datePicker,
}: {
  header: React.ReactNode;
  children: React.ReactNode;
  charts: React.ReactNode;
  datePicker: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-4 grid-rows-12 gap-8 max-md:grid-cols-1 h-[100vh]">
      <div className="row-span-2 col-span-full">
        {header}
      </div>
      <div className="col-span-full row-span-1 overflow-x-auto no-scrollbar">
        {datePicker}
      </div>
      <div className="col-start-1 row-span-8 col-span-2 row max-md:hidden">
        {charts}
      </div>
      <div className="col-start-3 col-span-2 max-md:col-start-1 max-md:col-span-1">
        {children}
      </div>
    </div>
  );
}
