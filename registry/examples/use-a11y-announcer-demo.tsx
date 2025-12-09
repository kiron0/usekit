"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  useA11yAnnouncer,
  type PolitenessSetting,
} from "registry/hooks/use-a11y-announcer"

const PRESETS: {
  label: string
  text: string
  politeness: PolitenessSetting
}[] = [
  { label: "Success", text: "Saved successfully", politeness: "polite" },
  { label: "Info", text: "Navigation updated", politeness: "polite" },
  {
    label: "Warning",
    text: "Unsaved changes detected",
    politeness: "assertive",
  },
  {
    label: "Error",
    text: "Submission failed. Try again.",
    politeness: "assertive",
  },
]

export default function UseA11yAnnouncerDemo() {
  const { announce } = useA11yAnnouncer()
  const [message, setMessage] = React.useState("Form submitted successfully")
  const [last, setLast] = React.useState<{
    text: string
    politeness: PolitenessSetting
  } | null>(null)
  const [history, setHistory] = React.useState<
    { text: string; politeness: PolitenessSetting; ts: number }[]
  >([])

  const send = (text: string, politeness: PolitenessSetting) => {
    const trimmed = text.trim()
    if (!trimmed) return
    announce(trimmed, politeness)
    setLast({ text: trimmed, politeness })
    setHistory((prev) =>
      [{ text: trimmed, politeness, ts: Date.now() }, ...prev].slice(0, 5)
    )
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="a11y-text">
          Announcement text
        </label>
        <Input
          id="a11y-text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g., Form submitted successfully"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => send(message, "polite")}>
          Announce (polite)
        </Button>
        <Button variant="secondary" onClick={() => send(message, "assertive")}>
          Announce (assertive)
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <Button
            key={preset.label}
            size="sm"
            variant="outline"
            onClick={() => send(preset.text, preset.politeness)}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      <div className="rounded-lg border bg-card p-3 text-sm">
        <div className="font-medium">Last announcement</div>
        {last ? (
          <p className="mt-1 text-muted-foreground">
            [{last.politeness}] {last.text}
          </p>
        ) : (
          <p className="mt-1 text-muted-foreground">No announcements yet.</p>
        )}
      </div>

      {history.length > 0 && (
        <div className="rounded-lg border bg-card p-3 text-sm">
          <div className="font-medium">Recent (last 5)</div>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            {history.map((item) => (
              <li key={item.ts}>
                [{item.politeness}] {item.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        This uses shared ARIA live regions (polite and assertive) to announce
        screen reader messages globally.
      </p>
    </div>
  )
}
