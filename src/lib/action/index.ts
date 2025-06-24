"use server"

import { env } from "@/env"

export async function createReport(data: {
  type: "report" | "feature"
  title: string
  hook?: string
  description: string
}) {
  const result = await fetch(
    `${env.NEXT_PUBLIC_BASE_API_URL}/report/create-report`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  )

  const returnData = await result.json()

  return returnData
}
