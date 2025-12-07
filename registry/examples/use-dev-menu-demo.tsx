"use client"

import { Bug, Code } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useDevMenu } from "registry/hooks/use-dev-menu"

export default function UseDevMenuDemo() {
  const isMac =
    typeof navigator !== "undefined" &&
    (/Mac|iPhone|iPad|iPod/.test(navigator.userAgent) ||
      (navigator as any).userAgentData?.platform === "macOS")
  const { open, close, isOpen } = useDevMenu()

  return (
    <div className="w-full space-y-6">
      <Card className="w-full border-none bg-transparent p-0">
        <CardHeader className="p-0">
          <CardTitle>Dev Menu</CardTitle>
          <CardDescription>
            Debug menu triggered by keyboard shortcut. Press{" "}
            <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-xs">
              {isMac ? "Cmd+Shift+D" : "Ctrl+Shift+D"}
            </kbd>{" "}
            to toggle the menu.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-0">
          <div className="flex items-center gap-4">
            <Button onClick={open} variant="outline">
              <Code className="h-4 w-4" />
              Open Dev Menu
            </Button>
            <Badge variant={isOpen ? "default" : "secondary"}>
              {isOpen ? "Open" : "Closed"}
            </Badge>
          </div>

          <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Bug className="h-5 w-5" />
                  Developer Menu
                </DialogTitle>
                <DialogDescription>
                  Debug tools and development utilities
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">
                        Environment Info
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Mode:</span>
                          <Badge variant="outline">Development</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            User Agent:
                          </span>
                          <span className="text-xs">
                            {navigator.userAgent.slice(0, 30)}...
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Viewport:
                          </span>
                          <span className="text-xs">
                            {window.innerWidth} × {window.innerHeight}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full">
                        Clear Cache
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        Reload Page
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        Show Console
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Debug Tools</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <Code className="h-4 w-4" />
                        View Source
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        <Bug className="h-4 w-4" />
                        Toggle Debug Mode
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </DialogContent>
          </Dialog>

          <div className="rounded-xl border border-dashed border-muted-foreground/40 p-4">
            <h4 className="mb-2 text-sm font-semibold">How it works</h4>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>
                Press{" "}
                <kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-xs">
                  {isMac ? "Cmd+Shift+D" : "Ctrl+Shift+D"}
                </kbd>{" "}
                to toggle the dev menu
              </li>
              <li>
                Use <code className="rounded bg-muted px-1">open()</code> and{" "}
                <code className="rounded bg-muted px-1">close()</code> to
                programmatically control the menu
              </li>
              <li>
                The <code className="rounded bg-muted px-1">isOpen</code> state
                tracks whether the menu is currently visible
              </li>
              <li>
                Keyboard shortcut is ignored when typing in input fields,
                textareas, or contenteditable elements
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
