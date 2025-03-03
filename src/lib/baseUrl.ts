"use server"

import { headers } from "next/headers"

export async function getBaseURL() {
  const host = (await headers()).get("host")
  const baseURL =
    host === "localhost:3000" ? `http://${host}` : `https://${host}`

  return baseURL
}
