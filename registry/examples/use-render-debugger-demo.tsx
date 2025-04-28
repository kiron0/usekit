"use client"

import * as React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRenderDebugger } from "registry/hooks/use-render-debugger"

export default function UseRenderDebuggerDemo() {
  const [profile, setProfile] = React.useState({
    name: "John Doe",
    email: "john@example.com",
    bio: "Software Engineer",
    location: "San Francisco",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <ProfileDisplay
        name={profile.name}
        email={profile.email}
        bio={profile.bio}
        location={profile.location}
      />
      <div className="space-y-4">
        {Object.entries(profile).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Label>
            <Input
              id={key}
              name={key}
              value={value}
              onChange={handleChange}
              placeholder={`Enter ${key}`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

interface ProfileProps {
  name: string
  email: string
  bio: string
  location: string
}

function ProfileDisplay({ name, email, bio, location }: ProfileProps) {
  useRenderDebugger(
    "ProfileDisplay",
    { name, email, bio, location },
    {
      trackOnly: ["name", "location"], // Only track name and location changes
      logger: (message, changes) => {
        console.group(message)
        Object.entries(changes).forEach(([key, { from, to }]) => {
          console.log(
            `%c${key}:`,
            "color: #10b981; font-weight: bold;",
            `from "${from}" to "${to}"`
          )
        })
        console.groupEnd()
      },
    }
  )

  return (
    <div className="space-y-4">
      <div className="space-y-2 rounded-lg border p-4 shadow-sm">
        <p>
          <b>Name:</b> {name}
        </p>
        <p>
          <b>Email:</b> {email}
        </p>
        <p>
          <b>Bio:</b> {bio}
        </p>
        <p>
          <b>Location:</b> {location}
        </p>
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Open the console to track re-renders! Only <b>name</b> and{" "}
        <b>location</b> changes are tracked in the console.
      </p>
    </div>
  )
}
