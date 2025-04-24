"use server"

import { siteConfig } from "@/config/site"

export async function createReport(data: {
  type: "report" | "feature"
  title: string
  hook?: string
  description: string
}) {
  const result = await fetch(`${siteConfig.env.apiUrl}/report/create-report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  const returnData = await result.json()

  return returnData
}
