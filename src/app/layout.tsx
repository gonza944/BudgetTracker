import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Eczar } from "next/font/google";
import { TasksProvider } from "./providers/context";

const BlazheRegular = localFont({
  src: "./fonts/BlazheRegular.otf",
  variable: "--font-BlazheRegular",
});
const NapzerRegular = localFont({
  src: "./fonts/NapzerRegular.otf",
  variable: "--font-NapzerRegular",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${BlazheRegular.variable} ${NapzerRegular.className} antialiased`}>
        <main className="h-[100vh] md:p-4 max-sm:m-4 ">
          <TasksProvider>{children}</TasksProvider>
        </main>
      </body>
    </html>
  );
}
