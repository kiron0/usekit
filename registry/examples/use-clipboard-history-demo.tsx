"use client"

import * as React from "react"
import { ClipboardCopy, Trash2 } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useClipboardHistory } from "registry/hooks/use-clipboard-history"

export default function UseClipboardHistoryDemo() {
  const [snippet, setSnippet] = React.useState("")
  const [status, setStatus] = React.useState<string | null>(null)

  const { list, push, pull, clear } = useClipboardHistory({
    size: 8,
    secureClear: true,
  })

  const handleCopyAndSave = async () => {
    if (!snippet.trim()) {
      setStatus("Enter some text before copying.")
      return
    }

    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(snippet)
        setStatus("Copied to clipboard and recorded.")
      } catch (error) {
        console.warn("Failed to copy to clipboard:", error)
        setStatus("Saved locally. Clipboard copy failed.")
      }
    } else {
      setStatus("Saved locally (Clipboard API unavailable).")
    }

    push(snippet)
    setSnippet("")
  }

  const handleInsert = (value: string) => {
    setSnippet((prev) => (prev ? `${prev}\n${value}` : value))
  }

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Clipboard History</CardTitle>
          <CardDescription>
            Capture snippets manually or read the real clipboard to store past
            entries.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="clipboard-snippet">Snippet</Label>
            <Textarea
              id="clipboard-snippet"
              rows={4}
              placeholder="Type or paste something you want to keep..."
              value={snippet}
              onChange={(event) => setSnippet(event.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={handleCopyAndSave}>
                Save & copy
              </Button>
              <Button type="button" variant="secondary" onClick={pull}>
                Pull from clipboard
              </Button>
              <Button type="button" variant="destructive" onClick={clear}>
                <Trash2 className="h-4 w-4" />
                Secure clear
              </Button>
            </div>
            {status && (
              <p className="text-sm text-muted-foreground">{status}</p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>History</Label>
              <Badge variant="secondary">{list.length} items</Badge>
            </div>
            {list.length === 0 && (
              <Alert>
                <AlertDescription>
                  Use the buttons above to capture your first clipboard item.
                </AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              {list.map((entry, index) => (
                <div
                  key={`${entry}-${index}`}
                  className="rounded-lg border bg-muted/30 p-3 text-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="whitespace-pre-wrap break-words font-mono text-xs">
                      {entry}
                    </p>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => handleInsert(entry)}
                      className="shrink-0"
                    >
                      <ClipboardCopy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
