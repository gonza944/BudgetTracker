interface DatePickerProps {
  onDateChanged: (date: Date) => void;
}
const DatePicker: React.FC<DatePickerProps> = ({ onDateChanged }) => {
  const today = new Date();
  const days = [];

  for (let i = -10; i < 10; i++) {
    days.push(new Date(today.getTime() + i * 24 * 60 * 60 * 1000));
  }

  return (
    <div className="flex gap-4 overflow-x-auto no-scrollbar">
      <button
        className="text-neutralBackgroundColorInverted font-paragraph border-r-neutralBackgroundColorInverted border-r-[1px] pr-4"
        onClick={() => onDateChanged(today)}>
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
          key={day.getDate()}
          className="text-neutralBackgroundColorInverted hover:text-xl text-base font-paragraph border-r-neutralBackgroundColorInverted border-r-[1px] pr-4"
          onClick={() => onDateChanged(today)}>
          {day.toLocaleDateString("es-ES")}
        </button>
      ))}

      <button
        className="text-neutralBackgroundColorInverted font-paragraph pr-4"
        onClick={() => onDateChanged(today)}>
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
