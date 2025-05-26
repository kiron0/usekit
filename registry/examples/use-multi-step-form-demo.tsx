"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { notifySuccess } from "@/components/toast"
import { useMultiStepForm } from "registry/hooks/use-multi-step-form"

interface UserData {
  name: string
  email: string
  role: "user" | "admin" | "manager"
  notifications: boolean
}

interface Errors {
  name?: string
  email?: string
  role?: string
}

const TOTAL_STEPS = 4

export default function UseMultiStepFormDemo() {
  const [userData, setUserData] = React.useState<UserData>({
    name: "",
    email: "",
    role: "user",
    notifications: true,
  })
  const [errors, setErrors] = React.useState<Errors>({})

  const {
    currentStep,
    next,
    previous,
    isLastStep,
    progress,
    canGoNext,
    canGoPrevious,
  } = useMultiStepForm({
    totalSteps: TOTAL_STEPS,
  })

  const handleNext = React.useCallback(() => {
    const newErrors: Errors = {}

    if (currentStep === 0 && !userData.name) {
      newErrors.name = "Name is required"
    }

    if (currentStep === 1) {
      if (!userData.email) newErrors.email = "Email is required"
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
        newErrors.email = "Invalid email format"
      }
    }

    if (currentStep === 2 && !userData.role) {
      newErrors.role = "Role is required"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      next()
    }
  }, [currentStep, userData, next])

  const handleSubmit = () => {
    notifySuccess({
      title: "Setup Complete",
      description: `Welcome ${userData.name}! Your setup is complete.`,
    })
  }

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" && canGoNext) {
        handleNext()
      } else if (event.key === "ArrowLeft" && canGoPrevious) {
        previous()
      } else if (event.key === "Enter" && canGoNext) {
        handleNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [canGoNext, canGoPrevious, handleNext, previous])

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="flex items-center gap-2">
        <div className="h-1 flex-1 rounded-full bg-muted">
          <div
            className="h-1 rounded-full bg-primary"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="text-sm">
          Step {currentStep + 1} of {TOTAL_STEPS}
        </span>
      </div>

      <div className="space-y-2">
        {currentStep === 0 && (
          <>
            <h2 className="text-lg font-medium">
              Welcome! What&apos;s your name?
            </h2>
            <Input
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-sm font-semibold text-destructive">
                {errors.name}
              </p>
            )}
          </>
        )}

        {currentStep === 1 && (
          <>
            <h2 className="text-lg font-medium">Contact Information</h2>
            <Input
              type="email"
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-sm font-semibold text-destructive">
                {errors.email}
              </p>
            )}
          </>
        )}

        {currentStep === 2 && (
          <>
            <h2 className="text-lg font-medium">Your Role</h2>
            <Select
              value={userData.role}
              onValueChange={(value) =>
                setUserData({ ...userData, role: value as UserData["role"] })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Regular User</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm font-semibold text-destructive">
                {errors.role}
              </p>
            )}
          </>
        )}

        {currentStep === 3 && (
          <>
            <h2 className="text-lg font-medium">Notification Preferences</h2>
            <div className="flex items-center gap-2">
              <Checkbox
                id="notifications"
                checked={userData.notifications}
                onCheckedChange={(checked) =>
                  setUserData({
                    ...userData,
                    notifications: checked as boolean,
                  })
                }
              />
              <Label htmlFor="notifications">Receive email notifications</Label>
            </div>
          </>
        )}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={previous} disabled={!canGoPrevious}>
          Back
        </Button>
        {!isLastStep ? (
          <Button onClick={handleNext} disabled={!canGoNext}>
            Continue
          </Button>
        ) : (
          <Button onClick={handleSubmit}>Complete Setup</Button>
        )}
      </div>
    </div>
  )
}
