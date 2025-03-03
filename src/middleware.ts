import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname !== "/log-in") {
    return NextResponse.redirect(new URL("/log-in", req.url));
  }
});

export const config = {
  matcher: ["/((?!_next|api/auth).*)(.+)"],
};
