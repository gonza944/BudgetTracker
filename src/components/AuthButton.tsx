import { FormEventHandler } from "react";

interface AuthButtonProps {
  onSubmit: (formData: FormData) => void | Promise<void>;
  isLogout?: boolean;
}

export default function AuthButton({ onSubmit, isLogout = false }: AuthButtonProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col w-full md:max-w-md p-8 md:rounded-2xl md:bg-[#EAE9DC]/90 md:backdrop-blur-md md:shadow-lg bg-neutralBackgroundColor">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-neutralBackgroundColorInverted mb-8">
            {isLogout ? "Log Out" : "Log In"}
          </h1>
        </div>
        <form action={onSubmit} className="space-y-4">
          <button
            type="submit"
            className="w-full p-3 rounded-lg bg-primaryColor text-fontColorInverted font-semibold hover:bg-primaryColor/90 transition-colors duration-200 flex items-center justify-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
              className="w-5 h-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {isLogout ? "Sign out from Google" : "Sign in with Google"}
          </button>
        </form>
      </div>
    </div>
  );
}
