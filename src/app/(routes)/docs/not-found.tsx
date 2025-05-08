import { type Metadata } from "next"

import { NotFound } from "@/components/not-found"

export const metadata: Metadata = {
  title: "Not Found",
  description: "The page you are looking for doesn't exist.",
}

export default function Page() {
  return <NotFound />
}
