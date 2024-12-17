import { redirect } from "next/navigation";
import { getFirstAndLastDayOfTheMonthInScoreFormat } from "./landing/utils";
import { initialState } from "./providers/generalReducer";
import { getExpenses, getProject } from "./landing/@expenses/dashboardActions";

export default function Home() {
  const { firstDay, lastDay } = getFirstAndLastDayOfTheMonthInScoreFormat(
    initialState.selectedExpensesDay.getMonth()
  );
  void getProject(initialState.currentProject);
  void getExpenses(`${initialState.currentProject}:expenses`, firstDay, lastDay);
  redirect("/landing");
}
