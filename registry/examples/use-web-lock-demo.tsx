"use client"

import * as React from "react"
import { Lock, LockOpen, ShieldCheck } from "lucide-react"

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
import { useWebLock } from "registry/hooks/use-web-lock"

export default function UseWebLockDemo() {
  const [name, setName] = React.useState("inventory-sync")
  const { isSupported, isLocked, error, acquire, release } = useWebLock(name)

  return (
    <div className="w-full space-y-6">
      <Card className="w-full border-none bg-transparent p-0">
        <CardHeader className="flex flex-col justify-between gap-3 p-0 lg:flex-row">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              Web Lock
            </CardTitle>
            <CardDescription>
              Coordinate exclusive work across tabs so only one client performs
              a mutation, migration, or refresh job at a time.
            </CardDescription>
          </div>
          <Badge
            variant={isSupported ? "default" : "outline"}
            className="flex items-center gap-1"
          >
            {isLocked ? (
              <Lock className="h-3.5 w-3.5" />
            ) : (
              <LockOpen className="h-3.5 w-3.5" />
            )}
            {isLocked ? "Lock held" : "Not locked"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4 p-0">
          <div className="space-y-2">
            <Label htmlFor="web-lock-name">Lock name</Label>
            <Input
              id="web-lock-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="background-sync"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={() => void acquire()}
              disabled={!isSupported || isLocked || !name}
            >
              <Lock className="h-4 w-4" />
              Acquire lock
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={release}
              disabled={!isLocked}
            >
              <LockOpen className="h-4 w-4" />
              Release
            </Button>
          </div>

          {error && (
            <p className="text-xs text-destructive">
              {error.message || "Failed to manage the web lock."}
            </p>
          )}

          <p className="text-xs text-muted-foreground">
            This is useful for cross-tab leader election, background sync
            ownership, and single-writer browser workflows.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
