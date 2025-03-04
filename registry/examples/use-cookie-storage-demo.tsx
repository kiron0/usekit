import { useCookieStorage } from "registry/hooks/use-cookie-storage"

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface UserPreferences {
  theme: "light" | "dark"
  fontSize: number
}

export default function UseCookieStorageDemo() {
  const [username, setUsername] = useCookieStorage("username", "guest", {
    path: "/",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    sameSite: "Lax",
  })

  const [preferences, setPreferences] = useCookieStorage<UserPreferences>(
    "preferences",
    { theme: "light", fontSize: 16 },
    { path: "/", secure: true }
  )

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label>Username</Label>
        <Input
          value={username}
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Preferences</Label>
        <Select
          defaultValue={preferences.theme}
          value={preferences.theme}
          onValueChange={(value) =>
            setPreferences((prev) => ({
              ...prev,
              theme: value as "light" | "dark",
            }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Font Size</Label>
        <Input
          type="number"
          placeholder="Font Size"
          value={preferences.fontSize}
          onChange={(e) =>
            setPreferences((prev) => ({
              ...prev,
              fontSize: Number(e.target.value),
            }))
          }
        />
      </div>

      <div className="col-span-full space-y-2 flex flex-col justify-center items-center">
        <h3 className="text-lg font-semibold underline">Results</h3>
        <div className="text-sm space-y-2">
          <p>Username: {username}</p>
          <div className="flex items-center gap-2">
            Theme: <Badge className="capitalize">{preferences.theme}</Badge>
          </div>
          <p>Font Size: {preferences.fontSize}px</p>
        </div>
      </div>
    </div>
  )
}
