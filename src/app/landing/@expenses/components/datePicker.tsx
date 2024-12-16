"use client";

import { useEffect, useState } from "react";

interface DatePickerProps {
  onDateChanged: (date: Date) => void;
}
const DatePicker: React.FC<DatePickerProps> = ({ onDateChanged }) => {
  const [selectedDate, setselectedDate] = useState(new Date());
  const days = Array.from({ length: 31 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 15 + i); // Start 15 days before today
    return date;
  });

  const handleOndateChanged = (date: Date) => {
    setselectedDate(date);
    onDateChanged(date);
  };
  const centerElement = () => {
    document
      .getElementById(selectedDate.toLocaleDateString("es-ES"))
      ?.scrollIntoView({
        block: "center",
        inline: "center",
        behavior: "smooth",
      });
  };

  useEffect(() => {
    centerElement();
  }, []);

  useEffect(() => {
    centerElement();
  }, [selectedDate]);

  return (
    <div className="flex gap-4 overflow-x-auto no-scrollbar mb-10">
      <button className="text-textColor font-paragraph border-r-textColor border-r-[1px] pr-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-5 hover:size-6">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
      </button>

      {days.map((day) => (
        <button
          key={day.toLocaleDateString("es-ES")}
          id={day.toLocaleDateString("es-ES")}
          className={`hover:text-xl ${
            day.toLocaleDateString("es-ES") ===
            selectedDate.toLocaleDateString("es-ES")
              ? "text-accentColor font-bold"
              : "text-textColor"
          } text-base font-paragraph border-r-textColor border-r-[1px] pr-4`}
          onClick={() => handleOndateChanged(day)}>
          {day.toLocaleDateString("es-ES")}
        </button>
      ))}

      <button className="text-textColor font-paragraph pr-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-5 hover:size-6">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
    </div>
  );
};

export default DatePicker;
