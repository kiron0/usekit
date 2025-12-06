"use client"

import * as React from "react"
import { Bug, Code, Eye, EyeOff, Settings } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useDevFlag } from "registry/hooks/use-dev-flag"

export default function UseDevFlagDemo() {
  const isDev = useDevFlag()
  const [showDebugInfo, setShowDebugInfo] = React.useState(false)
  const [devFeatureEnabled, setDevFeatureEnabled] = React.useState(false)

  return (
    <div className="w-full space-y-6">
      <Card className="w-full border-none bg-transparent p-0">
        <CardHeader className="flex flex-col justify-between gap-3 p-0 lg:flex-row">
          <div>
            <CardTitle>Dev Flag</CardTitle>
            <CardDescription>
              Enable behaviors ONLY in dev mode. Perfect for debug tools,
              development features, and testing utilities.
            </CardDescription>
          </div>
          <div>
            <Badge variant={isDev ? "default" : "secondary"}>
              {isDev ? (
                <>
                  <Code className="mr-1 h-3 w-3" />
                  Dev Mode
                </>
              ) : (
                <>
                  <Settings className="mr-1 h-3 w-3" />
                  Production
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-0">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bug className="h-5 w-5" />
                  Current Environment
                </CardTitle>
                <CardDescription>
                  The hook detects if you&apos;re running in development mode.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">Environment</span>
                    <Badge variant={isDev ? "default" : "outline"}>
                      {isDev ? "Development" : "Production"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isDev
                      ? "You're running in development mode. Dev-only features are enabled."
                      : "You're running in production mode. Dev-only features are disabled."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {isDev && (
              <Card className="border-green-500/50 bg-green-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <Eye className="h-5 w-5" />
                    Dev-Only Features
                  </CardTitle>
                  <CardDescription>
                    These features are only visible in development mode.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowDebugInfo(!showDebugInfo)}
                    >
                      {showDebugInfo ? (
                        <>
                          <EyeOff className="h-4 w-4" />
                          Hide Debug Info
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" />
                          Show Debug Info
                        </>
                      )}
                    </Button>
                    {showDebugInfo && (
                      <div className="rounded-lg border bg-background p-4">
                        <h4 className="mb-2 text-sm font-semibold">
                          Debug Information
                        </h4>
                        <pre className="whitespace-pre-wrap text-xs">
                          {JSON.stringify(
                            {
                              timestamp: new Date().toISOString(),
                              userAgent: navigator.userAgent,
                              viewport: {
                                width: window.innerWidth,
                                height: window.innerHeight,
                              },
                            },
                            null,
                            2
                          )}
                        </pre>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      onClick={() => setDevFeatureEnabled(!devFeatureEnabled)}
                    >
                      {devFeatureEnabled
                        ? "Disable Dev Feature"
                        : "Enable Dev Feature"}
                    </Button>
                    {devFeatureEnabled && (
                      <div className="rounded-lg border bg-background p-4">
                        <p className="text-sm">
                          This is a development-only feature that would not be
                          available in production.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {!isDev && (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <EyeOff className="mb-4 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Dev-only features are hidden in production mode.
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Run the app in development mode to see dev features.
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="rounded-xl border border-dashed border-muted-foreground/40 p-4">
              <h4 className="mb-2 text-sm font-semibold">How it works</h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                <li>
                  Call{" "}
                  <code className="rounded bg-muted px-1">useDevFlag()</code> to
                  get a boolean indicating dev mode
                </li>
                <li>
                  Returns <code className="rounded bg-muted px-1">true</code>{" "}
                  when <code className="rounded bg-muted px-1">NODE_ENV</code>{" "}
                  is{" "}
                  <code className="rounded bg-muted px-1">
                    &quot;development&quot;
                  </code>
                </li>
                <li>
                  Use it to conditionally render debug tools, dev features, or
                  testing utilities
                </li>
                <li>
                  Perfect for keeping development-only code out of production
                  builds
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
