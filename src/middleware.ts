export { auth as middleware } from "@/src/app/api/auth/[...nextauth]/route";
export const config = {
  matcher: ["/((?!api|_next|logout|verify|register.*\\..*).*)"],
};
