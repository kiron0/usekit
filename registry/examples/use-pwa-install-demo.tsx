"use client"

import * as React from "react"
import { Download, Shield } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { usePWAInstall } from "registry/hooks/use-pwa-install"

export default function UsePWAInstallDemo() {
  const { canInstall, isInstalled, promptCount, promptInstall } =
    usePWAInstall()
  const [status, setStatus] = React.useState<string | null>(null)

  const handleInstall = async () => {
    const outcome = await promptInstall()
    if (outcome === "accepted") {
      setStatus("Thanks! The PWA install flow was accepted.")
    } else if (outcome === "dismissed") {
      setStatus("Install prompt dismissed by the user.")
    } else {
      setStatus("Install prompt unavailable in this environment.")
    }
  }

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>PWA Install Manager</CardTitle>
            <CardDescription>
              Detect when the install prompt is available and trigger it safely.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge variant={isInstalled ? "secondary" : "outline"}>
              {isInstalled ? "Installed" : "Not installed"}
            </Badge>
            <Badge variant="outline">Prompts shown: {promptCount}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Download className="h-4 w-4" />
              Install Flow
            </div>
            <p className="text-sm text-muted-foreground">
              The install prompt appears only in browsers that support the
              Progressive Web App flow (Chrome, Edge, etc.) and when the page
              meets installability criteria.
            </p>
            <Button onClick={handleInstall} disabled={!canInstall}>
              Prompt install
            </Button>
            {!canInstall && (
              <p className="text-xs text-muted-foreground">
                Hint: open this demo on a PWA-capable browser and ensure the
                site is served over HTTPS.
              </p>
            )}
          </section>

          <Separator />

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Shield className="h-4 w-4" />
              Why gate prompts?
            </div>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>
                Only show the prompt when the browser says it is installable.
              </li>
              <li>
                Avoid spamming users by tracking how many times you prompted.
              </li>
              <li>React to acceptance/dismissal results and tune your UI.</li>
            </ul>
          </section>

          {status && (
            <Alert>
              <AlertTitle>Install status</AlertTitle>
              <AlertDescription>{status}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
