import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { env } from "@/env"

const pathnames = ["/docs/development"]

export function middleware(request: NextRequest) {
  if (
    env.NEXT_PUBLIC_NODE_ENV === "production" &&
    pathnames.includes(request.nextUrl.pathname)
  ) {
    return NextResponse.redirect(new URL("/docs", request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/docs/development"],
}
