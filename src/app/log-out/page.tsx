import { signOut } from "next-auth/react";
import AuthButton from "../../components/AuthButton";

export default function LogOutPage() {
  const handleLogout = async () => {
    "use server";
    await signOut();
  };

  return <AuthButton onSubmit={handleLogout} isLogout={true} />;
} 