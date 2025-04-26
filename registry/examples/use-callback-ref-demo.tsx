"use client"

import { siteName } from "@/utils"

import { Button } from "@/components/ui/button"
import { notifySuccess } from "@/components/toast"
import { useCallbackRef } from "registry/hooks/use-callback-ref"

export default function UseCallbackRefDemo() {
  const logMessage = useCallbackRef((message: string) => {
    notifySuccess({
      title: "Message Logged",
      description: message,
    })
  })

  return (
    <Button onClick={() => logMessage(`Hello from ${siteName}!`)}>
      Log Message
    </Button>
  )
}
