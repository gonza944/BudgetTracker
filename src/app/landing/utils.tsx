export const getDateInScoreFormat = (selectedDate: Date) => {
  const year = selectedDate.getFullYear(),
    month = (selectedDate.getMonth() + 1).toString().padStart(2, "0"),
    date = selectedDate.getDate().toString().padStart(2, "0");

  return Number.parseInt(`${year}${month}${date}`);
};

export const getFirstDayOfTheMonthInScoreFormat = (selectedDate: Date) => {
  const year = selectedDate.getFullYear(),
    month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");

  return Number.parseInt(`${year}${month}01${FIRSTEXPENSE}`);
};

export const getFirstDayOfTheFollowingMonthInScoreFormat = (
  selectedDate: Date
) => {
  const year = selectedDate.getFullYear(),
    month = (selectedDate.getMonth() + 2).toString().padStart(2, "0");

  if (Number.parseInt(month) > 12) {
    return Number.parseInt(`${year + 1}0101${FIRSTEXPENSE}`);
  }

  return Number.parseInt(`${year}${month}01${FIRSTEXPENSE}`);
};

export const FIRSTEXPENSE = '0000';
