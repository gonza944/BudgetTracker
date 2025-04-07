import { redirect } from "next/navigation";
import { getFirstAndLastDayOfTheMonthInScoreFormat } from "./landing/utils";
import { getExpenses, getProject } from "./landing/dashboardActions";
import { auth } from "@/auth";
import { AuthUserSchema, DEFAULT_PROJECT, getUserExpensesKey, getUserProjectKey, sanitizeEmail } from "@/utils/userUtils";

export default async function Home() {
  const { firstDay, lastDay } = getFirstAndLastDayOfTheMonthInScoreFormat(
    new Date().getMonth()
  );
  const session = await auth();
  const validatedSession = AuthUserSchema.parse(session);
  const userEmail = sanitizeEmail(validatedSession.user.email);
  
  void getProject(getUserProjectKey(userEmail, DEFAULT_PROJECT));
  void getExpenses(getUserExpensesKey(userEmail, DEFAULT_PROJECT), firstDay, lastDay);
  redirect("/landing");
}
