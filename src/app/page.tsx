import { redirect } from "next/navigation";
import { getFirstAndLastDayOfTheMonthInScoreFormat } from "./landing/utils";
import { getExpenses, getProject } from "./landing/dashboardActions";

export default function Home() {
  const { firstDay, lastDay } = getFirstAndLastDayOfTheMonthInScoreFormat(
    new Date().getMonth()
  );
  void getProject('project:viaje-europa-2024');
  void getExpenses(`${'project:viaje-europa-2024'}:expenses`, firstDay, lastDay);
  redirect("/landing");
}
