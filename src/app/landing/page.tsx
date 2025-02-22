'use client'
import { useEffect } from "react";
import { useProjectStore } from "../store/projectStore";
import Dashboard from "./components/dashboard";
import { getFirstAndLastDayOfTheMonthInScoreFormat } from "./utils";

export default function Page() {
  const { setProject, projectName, selectedExpensesDay, setMonthlyExpenses } = useProjectStore();

  const { firstDay, lastDay } = getFirstAndLastDayOfTheMonthInScoreFormat(
    selectedExpensesDay.getMonth()
  );

  useEffect(() => {
    setProject(projectName);
    setMonthlyExpenses(`${projectName}:expenses`, firstDay, lastDay);
  }, [])

  return <Dashboard />;
}
