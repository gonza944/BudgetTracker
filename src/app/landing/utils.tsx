export const getDateInScoreFormatWithoutExpenseNumber = (
  selectedDate: Date
) => {
  const year = selectedDate.getFullYear(),
    month = (selectedDate.getMonth() + 1).toString().padStart(2, "0"),
    date = selectedDate.getDate().toString().padStart(2, "0");

  return Number.parseInt(`${year}${month}${date}`);
};

export const getDateInScoreFormat = (selectedDate: Date) =>
  Number.parseInt(
    `${getDateInScoreFormatWithoutExpenseNumber(selectedDate)}${FIRSTEXPENSE}`
  );

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

export const getFirstAndLastDayOfTheMonthInScoreFormat = (
  monthNumber: number
) => {
  const firstDay = new Date(new Date().getFullYear(), monthNumber, 1);
  const lastDay = new Date(new Date().getFullYear(), monthNumber + 1, 0);
  return {
    firstDay: Number.parseInt(
      `${getDateInScoreFormatWithoutExpenseNumber(firstDay)}${FIRSTEXPENSE}`
    ),
    lastDay: Number.parseInt(
      `${getDateInScoreFormatWithoutExpenseNumber(lastDay)}${FIRSTEXPENSE}`
    ),
  };
};

export const getFirstAndLastDayOfTheMonth = (month: number) => {
  const firstDay = new Date(new Date().getFullYear(), month, 1);
  const lastDay = new Date(new Date().getFullYear(), month + 1, 0);
  return {
    firstDay,
    lastDay,
  };
};

export const getDateFromScore = (score: number) => {
  const scoreString = score.toString();
  const year = scoreString.substring(0, 4),
    month = scoreString.substring(4, 6),
    date = scoreString.substring(6, 8);

  return new Date(
    Number.parseInt(year),
    Number.parseInt(month) - 1,
    Number.parseInt(date)
  );
};

export const getNextDayFromAScoreInScoreFormat = (score: number) => {
  const date = getDateFromScore(score);
  const nextDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + 1
  );
  return getDateInScoreFormatWithoutExpenseNumber(nextDate);
};

export const FIRSTEXPENSE = "0000";
