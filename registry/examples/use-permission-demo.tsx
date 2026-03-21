"use client"

import { Bell, MapPinned, RefreshCcw } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { usePermission } from "registry/hooks/use-permission"

export default function UsePermissionDemo() {
  const notifications = usePermission("notifications")
  const geolocation = usePermission("geolocation")

  return (
    <div className="w-full space-y-6">
      <Card className="w-full border-none bg-transparent p-0">
        <CardHeader className="flex flex-col justify-between gap-3 p-0 lg:flex-row">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Permission State
            </CardTitle>
            <CardDescription>
              Track browser permission status reactively so UI can explain why a
              feature is blocked before the user hits a dead end.
            </CardDescription>
          </div>
          <Badge
            variant={notifications.isSupported ? "default" : "outline"}
            className="flex items-center gap-1"
          >
            {notifications.isSupported
              ? "Permissions API ready"
              : "Unsupported"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4 p-0">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="flex items-center gap-2 text-sm font-medium">
                <Bell className="h-4 w-4" />
                Notifications
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {notifications.state || "Unknown"}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="flex items-center gap-2 text-sm font-medium">
                <MapPinned className="h-4 w-4" />
                Geolocation
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {geolocation.state || "Unknown"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => void notifications.refresh()}
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh notifications
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => void geolocation.refresh()}
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh geolocation
            </Button>
          </div>

          {(notifications.error || geolocation.error) && (
            <p className="text-xs text-destructive">
              {notifications.error?.message ||
                geolocation.error?.message ||
                "Failed to query permission state."}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
