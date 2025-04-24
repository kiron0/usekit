"use server"

import { siteConfig } from "@/config/site"

export async function createReport(data: {
  name: string
  message: string
  email: string
}) {
  const result = await fetch(`${siteConfig.baseApiUrl}/report/create-report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  const returnData = await result.json()

  return returnData
}
