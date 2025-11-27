"use client"

import * as React from "react"
import { AlertCircle, Clock, ShieldCheck, Trash } from "lucide-react"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useFormAutosave } from "registry/hooks/use-form-autosave"

interface Task {
  id: string
  text: string
}

interface ApplicationFormValues {
  applicant: {
    firstName: string
    lastName: string
    email: string
  }
  coverLetter: string
  availability: string
  tasks: Task[]
}

const INITIAL_VALUES: ApplicationFormValues = {
  applicant: {
    firstName: "",
    lastName: "",
    email: "",
  },
  coverLetter: "",
  availability: "",
  tasks: [
    { id: "task-1", text: "Research the product surface" },
    { id: "task-2", text: "Highlight a proudest build" },
  ],
}

const AUTOSAVE_NAME = "demo-application"
const STORAGE_KEY = `usekit:form-autosave:${AUTOSAVE_NAME}`

export default function UseFormAutosaveDemo() {
  const [values, setValues] =
    React.useState<ApplicationFormValues>(INITIAL_VALUES)
  const [newTask, setNewTask] = React.useState("")

  const {
    savedAt,
    isSaving,
    hasDraft,
    hasConflict,
    conflict,
    restore,
    clear,
    flush,
    hydratedValues,
  } = useFormAutosave(AUTOSAVE_NAME, values, {
    debounceMs: 1200,
  })

  const handleApplicantChange = (
    field: keyof ApplicationFormValues["applicant"],
    value: string
  ) => {
    setValues((prev) => ({
      ...prev,
      applicant: {
        ...prev.applicant,
        [field]: value,
      },
    }))
  }

  const formatSavedAt = React.useMemo(() => {
    if (!savedAt) return "Not saved yet"
    return new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(savedAt)
  }, [savedAt])

  const handleRestore = () => {
    const draft = restore()
    if (draft) {
      setValues(draft)
    }
  }

  React.useEffect(() => {
    if (hydratedValues) {
      setValues(hydratedValues)
    }
  }, [hydratedValues])

  const handleAddTask = () => {
    if (!newTask.trim()) return
    setValues((prev) => ({
      ...prev,
      tasks: [
        ...prev.tasks,
        {
          id:
            typeof crypto !== "undefined" && crypto.randomUUID
              ? crypto.randomUUID()
              : Math.random().toString(36).slice(2),
          text: newTask.trim(),
        },
      ],
    }))
    setNewTask("")
  }

  const handleTaskEdit = (id: string, text: string) => {
    setValues((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === id ? { ...task, text } : task
      ),
    }))
  }

  const handleTaskRemove = (id: string) => {
    setValues((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((task) => task.id !== id),
    }))
  }

  const simulateExternalSave = () => {
    if (typeof window === "undefined") return
    const remoteValues = {
      ...values,
      coverLetter: `${values.coverLetter}\n\n(Edited in another tab)`,
    }
    const record = {
      values: remoteValues,
      savedAt: Date.now() + 500,
      sessionId: "external-session",
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: STORAGE_KEY,
        newValue: JSON.stringify(record),
      })
    )
  }

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div>
            <CardTitle>Application Form</CardTitle>
            <CardDescription>
              Auto-save drafts for long-format forms. Works with nested, dynamic
              data.
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-start gap-2 text-xs lg:justify-end">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span>
                {isSaving ? "Saving draft…" : `Saved at: ${formatSavedAt}`}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              {hasDraft && <Badge variant="secondary">Draft available</Badge>}
              {hasConflict && (
                <Badge variant="destructive">Conflict detected</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="first-name">First name</Label>
              <Input
                id="first-name"
                placeholder="Enter your first name"
                value={values.applicant.firstName}
                onChange={(event) =>
                  handleApplicantChange("firstName", event.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input
                id="last-name"
                placeholder="Enter your last name"
                value={values.applicant.lastName}
                onChange={(event) =>
                  handleApplicantChange("lastName", event.target.value)
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={values.applicant.email}
              onChange={(event) =>
                handleApplicantChange("email", event.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="availability">Availability window</Label>
            <Input
              id="availability"
              placeholder="e.g. Mornings, Pacific Time"
              value={values.availability}
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  availability: event.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover-letter">Cover letter</Label>
            <Textarea
              id="cover-letter"
              placeholder="Enter your cover letter"
              rows={5}
              value={values.coverLetter}
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  coverLetter: event.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Checklist</Label>
              <span className="text-xs text-muted-foreground">
                Add reminders for yourself
              </span>
            </div>
            <div className="space-y-2">
              {values.tasks.map((task) => (
                <div key={task.id} className="flex gap-2">
                  <Input
                    placeholder="Enter task text"
                    value={task.text}
                    onChange={(event) =>
                      handleTaskEdit(task.id, event.target.value)
                    }
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => handleTaskRemove(task.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Enter new task text"
                value={newTask}
                onChange={(event) => setNewTask(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault()
                    handleAddTask()
                  }
                }}
              />
              <Button type="button" onClick={handleAddTask}>
                Add
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleRestore}
              disabled={!hasDraft}
            >
              Restore draft
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={clear}
              disabled={!hasDraft}
            >
              Clear draft
            </Button>
            <Button type="button" variant="outline" onClick={flush}>
              Save draft now
            </Button>
            <Button type="button" onClick={simulateExternalSave}>
              Simulate conflict
            </Button>
          </div>

          {hasConflict && conflict && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="space-y-2 text-sm">
                <p>
                  A newer draft was saved in another tab at{" "}
                  {new Date(conflict.savedAt).toLocaleTimeString()}. Restore to
                  review those changes.
                </p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleRestore}>
                    Restore conflict draft
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {!hasConflict && hasDraft && (
            <Alert>
              <ShieldCheck className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Draft stored locally. You can safely refresh or leave this page.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
