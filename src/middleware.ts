import { auth } from "@/auth"
 
export default auth((req) => {
  /* if (!req.auth && req.nextUrl.pathname !== "/log-in") {
    const newUrl = new URL("/log-in", req.nextUrl.origin)
    return Response.redirect(newUrl)
  } */
})