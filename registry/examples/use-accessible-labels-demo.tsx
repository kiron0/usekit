"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useAccessibleLabels } from "registry/hooks/use-accessible-labels"

export default function UseAccessibleLabelsDemo() {
  const [analyticsEnabled, setAnalyticsEnabled] = React.useState(false)
  const [assistantEnabled, setAssistantEnabled] = React.useState(false)

  const analyticsA11y = useAccessibleLabels({
    label: "Allow product analytics",
    description: "Anonymous usage metrics used to improve the dashboard.",
  })

  const assistantA11y = useAccessibleLabels({
    fallback: () =>
      assistantEnabled ? "Disable AI assistant" : "Enable AI assistant",
  })

  const feedbackLabelId = "feedback-topic-label"
  const feedbackDescriptionId = "feedback-topic-description"
  const feedbackA11y = useAccessibleLabels({
    id: "feedback-topic",
    labelledBy: feedbackLabelId,
    describedBy: feedbackDescriptionId,
  })

  return (
    <div className="w-full space-y-6">
      <div className="space-y-3 rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <Label htmlFor={analyticsA11y.ariaProps.id}>
            Allow product analytics
          </Label>
          <Switch
            {...analyticsA11y.ariaProps}
            checked={analyticsEnabled}
            onCheckedChange={setAnalyticsEnabled}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {analyticsA11y.descriptionText}
        </p>
      </div>

      <div className="space-y-2 rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">AI assistant</p>
          <Button
            size="sm"
            variant={assistantEnabled ? "secondary" : "outline"}
            {...assistantA11y.ariaProps}
            onClick={() => setAssistantEnabled((prev) => !prev)}
          >
            {assistantEnabled ? "Disable" : "Enable"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Even icon-only buttons can stay accessible by spreading `ariaProps`.
        </p>
      </div>

      <div className="space-y-2 rounded-lg border p-4">
        <Label id={feedbackLabelId} htmlFor={feedbackA11y.ariaProps.id}>
          Feedback topic
        </Label>
        <p id={feedbackDescriptionId} className="text-xs text-muted-foreground">
          Explain the context for your accessibility request.
        </p>
        <Textarea
          placeholder="Navigation feels confusing on mobile…"
          {...feedbackA11y.ariaProps}
          className="min-h-[100px]"
        />
      </div>
    </div>
  )
}
