import { auth } from "@/auth";
import NewBudgetForm from "./components/NewBudgetForm";
import { AuthUserSchema, sanitizeEmail } from "@/utils/userUtils";

const NewBudgetPage = async () => {
  const session = await auth();
  const validatedSession = AuthUserSchema.parse(session);
  const userEmail = sanitizeEmail(validatedSession.user.email);

  return <NewBudgetForm email={userEmail} />;
};

export default NewBudgetPage;
