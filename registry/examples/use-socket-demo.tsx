"use client"

import * as React from "react"

import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { useSocket } from "registry/hooks/use-socket"

export default function UseSocketDemo() {
  const { socket, isConnected, connect, disconnect } = useSocket(
    siteConfig.socketUrl,
    {
      reconnectionDelay: 5000,
      reconnection: true,
    }
  )

  React.useEffect(() => {
    if (socket) {
      socket.on("message", (data) => {
        console.log("Received message:", data)
      })
    }

    return () => {
      if (socket) {
        socket.off("message")
      }
    }
  }, [socket])

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div>Status: {isConnected ? "🟢 Connected" : "🔴 Disconnected"}</div>
      {isConnected ? (
        <Button variant="destructive" onClick={disconnect}>
          Disconnect
        </Button>
      ) : (
        <Button onClick={connect}>Connect</Button>
      )}
      <Button
        onClick={() => {
          if (socket) {
            socket.emit("message", { message: "Hello from useKit!" })
          }
        }}
      >
        Send Message
      </Button>
      <p className="text-balance text-muted-foreground">
        Open the console to see the logs
      </p>
    </div>
  )
}
