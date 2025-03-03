import { signIn } from "@/auth";
import AuthButton from "@/components/AuthButton";

export default async function LogInPage() {
  async function handleSignIn() {
    "use server";
    await signIn("google", { redirectTo: "/landing" });
  }

  return <AuthButton onSubmit={handleSignIn} />;
}
