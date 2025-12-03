"use client"

import * as React from "react"
import { Link2, Share2, Smartphone } from "lucide-react"

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
import { Textarea } from "@/components/ui/textarea"
import { useCopyToClipboard } from "registry/hooks/use-copy-to-clipboard"
import { useNativeShare } from "registry/hooks/use-native-share"

export default function UseNativeShareDemo() {
  const [title, setTitle] = React.useState("Usekit - React hooks playground")
  const [text, setText] = React.useState(
    "Exploring a new hook library. Want to try it?"
  )
  const [url, setUrl] = React.useState("https://usekit.kiron.dev")

  const [copy, copied] = useCopyToClipboard()

  const { canShare, isSharing, error, share } = useNativeShare({
    onFallback: async (data) => {
      const payload = [data.title, data.text, data.url]
        .filter(Boolean)
        .join("\n\n")
      await copy(payload)
    },
  })

  const handleShare = async () => {
    await share({ title, text, url })
  }

  const disabled = !title && !text && !url

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader className="flex flex-col justify-between gap-3 lg:flex-row">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Native Share
            </CardTitle>
            <CardDescription>
              Trigger the Web Share sheet on supported devices with a simple
              `share(data)` call and a clipboard fallback.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={canShare ? "default" : "outline"}
              className="flex items-center gap-1"
            >
              <Smartphone className="h-3.5 w-3.5" />
              {canShare ? "Native share available" : "Fallback only"}
            </Badge>
            {copied && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Link2 className="h-3.5 w-3.5" />
                Copied to clipboard
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="share-title">Title</Label>
                <Input
                  id="share-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Optional title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="share-url">URL</Label>
                <Input
                  id="share-url"
                  type="url"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="share-text">Message</Label>
              <Textarea
                id="share-text"
                rows={5}
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="What do you want to share?"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={handleShare}
              disabled={disabled || isSharing}
            >
              <Share2 className="h-4 w-4" />
              {isSharing ? "Sharing…" : "Share"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                const payload = [title, text, url].filter(Boolean).join("\n\n")
                await copy(payload)
              }}
              disabled={disabled}
            >
              <Link2 className="h-4 w-4" />
              Copy as text
            </Button>
          </div>

          {error && (
            <p className="text-xs text-destructive">
              {error.message || "Failed to share."}
            </p>
          )}

          <p className="text-xs text-muted-foreground">
            Try this from a mobile browser with Web Share support to see the
            native sheet. On unsupported platforms, the payload falls back to
            the clipboard.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
