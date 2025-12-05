"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
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
import {
  usePayloadDiffGuard,
  type PayloadDiffEntry,
} from "registry/hooks/use-payload-diff-guard"

const INITIAL_DB_USER = {
  id: "user_123",
  name: "Ada Lovelace",
  email: "ada@example.com",
  role: "admin",
  profile: {
    bio: "First computer programmer.",
    location: "London",
  },
}

export default function UsePayloadDiffGuardDemo() {
  const [dbUser] = React.useState(INITIAL_DB_USER)
  const [formUser, setFormUser] = React.useState(INITIAL_DB_USER)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [lastSubmitted, setLastSubmitted] = React.useState<null | string>(null)

  const {
    hasChanges,
    isPristine,
    diffs,
    added,
    removed,
    changed,
    preventSubmit,
  } = usePayloadDiffGuard(dbUser, formUser, {
    ignorePath: (path) => path === "profile.bio",
  })

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsSubmitting(true)
    const didSubmit = await preventSubmit(async () => {
      await new Promise((resolve) => setTimeout(resolve, 600))
      setLastSubmitted(
        `${new Date().toLocaleTimeString()} — ${JSON.stringify(formUser)}`
      )
    })
    if (!didSubmit) {
      setLastSubmitted("Skipped submit — no changes detected.")
    }
    setIsSubmitting(false)
  }

  const handleFieldChange =
    <K extends keyof typeof formUser>(key: K) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value
      if (key === "profile") return
      setFormUser((prev) => ({
        ...prev,
        [key]: value,
      }))
    }

  const handleProfileFieldChange =
    (key: keyof (typeof formUser)["profile"]) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value
      setFormUser((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          [key]: value,
        },
      }))
    }

  const renderDiffRow = (entry: PayloadDiffEntry<typeof INITIAL_DB_USER>) => {
    return (
      <div
        key={entry.path}
        className={cn(
          "grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)] gap-2 rounded-lg border px-3 py-2 text-xs",
          entry.type === "added" && "border-emerald-500/60 bg-emerald-500/5",
          entry.type === "removed" && "border-rose-500/60 bg-rose-500/5",
          entry.type === "changed" &&
            "border-amber-500/60 bg-amber-500/5 dark:border-amber-400/70"
        )}
      >
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="px-1.5 py-0 text-[10px] uppercase"
          >
            {entry.type}
          </Badge>
          <span className="font-mono text-[11px] text-muted-foreground">
            {entry.path || "(root)"}
          </span>
        </div>
        <div className="truncate font-mono text-[11px] text-muted-foreground">
          {JSON.stringify(entry.dbValue)}
        </div>
        <div className="truncate font-mono text-[11px] text-foreground">
          {JSON.stringify(entry.inputValue)}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      <Card className="border-none bg-transparent p-0">
        <CardHeader className="flex flex-col justify-between gap-3 p-0 lg:flex-row">
          <div>
            <CardTitle className="flex items-center gap-2">
              Payload diff guard
            </CardTitle>
            <CardDescription>
              Deep-compare DB vs form payloads and skip no-op submissions.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Badge
              variant={hasChanges ? "default" : "outline"}
              className="uppercase"
            >
              {hasChanges ? "Dirty" : "Pristine"}
            </Badge>
            <span className="text-muted-foreground">
              {diffs.length} paths changed (ignored:{" "}
              <code className="font-mono text-[11px]">profile.bio</code>)
            </span>
          </div>
        </CardHeader>
        <CardContent className="mt-4 grid gap-6 p-0 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1.1fr)]">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-xl border bg-card/60 p-4"
          >
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formUser.name}
                  onChange={handleFieldChange("name")}
                  autoComplete="off"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formUser.email}
                  onChange={handleFieldChange("email")}
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={formUser.role}
                  onChange={handleFieldChange("role")}
                  autoComplete="off"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formUser.profile.location}
                  onChange={handleProfileFieldChange("location")}
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bio">
                Bio{" "}
                <span className="text-[11px] text-muted-foreground">
                  (ignored for diff)
                </span>
              </Label>
              <Textarea
                id="bio"
                rows={3}
                value={formUser.profile.bio}
                onChange={handleProfileFieldChange("bio")}
                className="resize-none"
              />
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 text-xs">
              <div className="space-y-0.5">
                <div>
                  <span className="font-medium">Status:</span>{" "}
                  {isPristine ? "No changes" : "Has unsaved changes"}
                </div>
                <div className="text-muted-foreground">
                  {added.length} added · {removed.length} removed ·{" "}
                  {changed.length} changed
                </div>
              </div>
              <Button
                type="submit"
                size="sm"
                disabled={isPristine || isSubmitting}
              >
                {isSubmitting
                  ? "Submitting..."
                  : isPristine
                    ? "Nothing to submit"
                    : "Submit only if changed"}
              </Button>
            </div>
          </form>

          <div className="space-y-3 rounded-xl border bg-card/60 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Deep diff
              </p>
              <span className="text-xs text-muted-foreground">
                {diffs.length === 0
                  ? "No structural differences."
                  : "Flattened JSON paths with DB vs input values."}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)] gap-2 rounded-lg bg-muted px-3 py-2 text-[11px] font-medium text-muted-foreground">
                <span>Path</span>
                <span className="truncate">DB value</span>
                <span className="truncate">Input value</span>
              </div>
              <div className="no-scrollbar max-h-64 space-y-1 overflow-auto">
                {diffs.length === 0 ? (
                  <p className="py-6 text-center text-xs text-muted-foreground">
                    Make a change to any field (except bio) to see the diff.
                  </p>
                ) : (
                  diffs.map(renderDiffRow)
                )}
              </div>
            </div>

            <div className="space-y-1 pt-2 text-xs">
              <p className="font-medium">Last submission</p>
              <p className="rounded-md border bg-background/60 p-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
                {lastSubmitted ?? "Nothing submitted yet."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
