"use client";

import { use } from "react";
import DatePicker from "../components/datePicker";
import { useProjectStore } from "@/app/store/projectStore";

export default function HeaderPage() {
  const { setNewSelectedExpensesDay } = useProjectStore();

  const handleOndateChanged = (date: Date) => {
    setNewSelectedExpensesDay(date);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="overflow-x-auto no-scrollbar">
        <DatePicker onDateChanged={handleOndateChanged} />
      </div>
    </div>
  );
}
