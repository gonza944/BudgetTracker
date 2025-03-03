import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Eczar } from "next/font/google";

const freudian = localFont({
  src: "./fonts/Freudian.otf",
  variable: "--font-freudian",
});

const eczar = Eczar({ subsets: ["latin"] });

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
      <body className={`${freudian.variable} ${eczar.className} antialiased `}>
        <main className="h-[100vh] md:p-16 max-sm:m-8 ">
          {children}
        </main>
      </body>
    </html>
  );
}
