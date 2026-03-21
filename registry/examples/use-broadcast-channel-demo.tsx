"use client"

import * as React from "react"
import { Radio, Send, WifiOff } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useBroadcastChannel } from "registry/hooks/use-broadcast-channel"

export default function UseBroadcastChannelDemo() {
  const [message, setMessage] = React.useState("Inventory synced")
  const [channelName, setChannelName] = React.useState("usekit-room")

  const sender = useBroadcastChannel<string>(channelName)
  const receiver = useBroadcastChannel<string>(channelName)

  return (
    <div className="w-full space-y-6">
      <Card className="w-full border-none bg-transparent p-0">
        <CardHeader className="flex flex-col justify-between gap-3 p-0 lg:flex-row">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Radio className="h-5 w-5" />
              Broadcast Channel
            </CardTitle>
            <CardDescription>
              Sync ephemeral messages across tabs without a server or shared
              storage polling loop.
            </CardDescription>
          </div>
          <Badge
            variant={sender.isSupported ? "default" : "outline"}
            className="flex items-center gap-1"
          >
            {sender.isSupported ? (
              <Radio className="h-3.5 w-3.5" />
            ) : (
              <WifiOff className="h-3.5 w-3.5" />
            )}
            {sender.isSupported ? "Multi-tab ready" : "Unsupported"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4 p-0">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="broadcast-channel-name">Channel name</Label>
              <Input
                id="broadcast-channel-name"
                value={channelName}
                onChange={(event) => setChannelName(event.target.value)}
                placeholder="notifications"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="broadcast-message">Message</Label>
              <Input
                id="broadcast-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="What should other tabs receive?"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={() => sender.postMessage(message)}
              disabled={!sender.isSupported || !message}
            >
              <Send className="h-4 w-4" />
              Broadcast message
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => receiver.close()}
              disabled={receiver.isClosed}
            >
              Close listener
            </Button>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Sender state
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {sender.isClosed ? "Closed" : "Connected"}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Last received
              </p>
              <p className="mt-2 text-sm font-medium">
                {receiver.lastMessage || "Nothing received yet"}
              </p>
            </div>
          </div>

          {(sender.error || receiver.error) && (
            <p className="text-xs text-destructive">
              {sender.error?.message ||
                receiver.error?.message ||
                "Broadcast channel failed."}
            </p>
          )}

          <p className="text-xs text-muted-foreground">
            Open the same page in another tab with the same channel name to see
            real cross-tab delivery.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
