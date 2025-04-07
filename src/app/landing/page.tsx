"use client";

import { useEffect } from "react";
import { useProjectStore } from "../store/projectStore";
import Dashboard from "./components/dashboard";
import { getFirstAndLastDayOfTheMonthInScoreFormat } from "./utils";
import { AuthUserSchema, getUserExpensesKey, getUserProjectKey, sanitizeEmail } from "@/utils/userUtils";
import { auth } from "@/auth";

export default async function Page() {
  const { setProject, projectName, selectedExpensesDay, setMonthlyExpenses } =
    useProjectStore();
    const session = await auth();
    const validatedSession = AuthUserSchema.parse(session);
    const userEmail = sanitizeEmail(validatedSession.user.email);

  const { firstDay, lastDay } = getFirstAndLastDayOfTheMonthInScoreFormat(
    selectedExpensesDay.getMonth()
  );

  useEffect(() => {
    setProject(getUserProjectKey(userEmail, projectName));
    setMonthlyExpenses(getUserExpensesKey(userEmail, projectName), firstDay, lastDay);
  }, []);

  return <Dashboard />;
}
