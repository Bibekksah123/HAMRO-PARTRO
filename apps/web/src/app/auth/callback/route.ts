import { createServerAuthClient } from "@merodin/auth";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const requestedNext = request.nextUrl.searchParams.get("next");
  const next =
    requestedNext?.startsWith("/") && !requestedNext.startsWith("//")
      ? requestedNext
      : "/my";
  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=confirmation", request.url),
    );
  }

  const cookieStore = await cookies();
  const supabase = createServerAuthClient({
    getAll: () => cookieStore.getAll(),
    set: (name, value, options) => cookieStore.set(name, value, options),
  });
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      new URL("/login?error=confirmation", request.url),
    );
  }
  return NextResponse.redirect(new URL(next, request.url));
}
