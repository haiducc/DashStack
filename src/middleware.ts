import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./app/api/auth/[...nextauth]/config";

export async function middleware(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.access_token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|login|register).*)", "/"],
};
