"use client";

import { generalContext } from "@/app/providers/context";
import { use } from "react";
import DatePicker from "../@expenses/components/datePicker";

export default function HeaderPage() {
  const { dispatch } = use(generalContext);

  const handleOndateChanged = (date: Date) => {
    dispatch({ type: "SET_SELECTED_EXPENSES_DAY", payload: date });
  };

  return (
    <div className="flex flex-col items-center">
      <div className=" col-start-1 col-span-6 max-md:col-start-1 max-md:col-span-1 row-span-1 flex justify-center max-md:justify-center overflow-x-auto no-scrollbar">
        <DatePicker onDateChanged={handleOndateChanged} />
      </div>
    </div>
  );
}
