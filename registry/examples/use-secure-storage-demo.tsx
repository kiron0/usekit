"use client"

import * as React from "react"
import { Eye, EyeOff, Lock, RefreshCw, Trash2 } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
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
import { useSecureStorage } from "registry/hooks/use-secure-storage"

function generateKey() {
  if (typeof window === "undefined" || !window.crypto?.getRandomValues) {
    return Math.random().toString(36).slice(2) + Date.now().toString(36)
  }

  const array = new Uint8Array(32)
  window.crypto.getRandomValues(array)
  return Array.from(array)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

export default function UseSecureStorageDemo() {
  const [inputValue, setInputValue] = React.useState("")
  const [showValue, setShowValue] = React.useState(false)
  const [storageType, setStorageType] = React.useState<
    "localStorage" | "sessionStorage"
  >("localStorage")
  const [ttl, setTtl] = React.useState<number | undefined>(undefined)
  const [encryptionKey, setEncryptionKey] = React.useState(generateKey)

  const {
    value: storedValue,
    setValue: setStoredValue,
    remove: removeValue,
  } = useSecureStorage("demo-secure-data", "", {
    storageType,
    ttl,
    encryptionKey,
  })

  const [rawStorage, setRawStorage] = React.useState("")

  React.useEffect(() => {
    const storage =
      storageType === "localStorage" ? localStorage : sessionStorage
    const raw = storage.getItem("demo-secure-data")
    setRawStorage(raw || "")
  }, [storedValue, storageType])

  const handleSave = () => {
    setStoredValue(inputValue)
    setInputValue("")
  }

  const handleRotateKey = () => {
    const nextKey = generateKey()
    setEncryptionKey(nextKey)

    if (storedValue) {
      queueMicrotask(() => {
        setStoredValue((prev) => prev)
      })
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Secure Storage
            </CardTitle>
            <CardDescription>
              Store and retrieve encrypted values with automatic key management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storage-type">Storage Type</Label>
              <div className="flex gap-2">
                <Button
                  variant={
                    storageType === "localStorage" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setStorageType("localStorage")}
                >
                  LocalStorage
                </Button>
                <Button
                  variant={
                    storageType === "sessionStorage" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setStorageType("sessionStorage")}
                >
                  SessionStorage
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ttl">TTL (Time to Live) in milliseconds</Label>
              <Input
                id="ttl"
                type="number"
                placeholder="Leave empty for no expiration"
                value={ttl || ""}
                onChange={(e) =>
                  setTtl(
                    e.target.value ? parseInt(e.target.value, 10) : undefined
                  )
                }
              />
              {ttl && (
                <p className="text-xs text-muted-foreground">
                  Expires in: {Math.round(ttl / 1000)} seconds
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="input-value">Value to store</Label>
              <div className="flex gap-2">
                <Input
                  id="input-value"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter sensitive data"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSave()
                    }
                  }}
                />
                <Button onClick={handleSave} disabled={!inputValue.trim()}>
                  Save
                </Button>
              </div>
            </div>

            {storedValue && (
              <div className="space-y-2 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <Label>Stored Value (Decrypted)</Label>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowValue(!showValue)}
                  >
                    {showValue ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="rounded bg-muted p-2 font-mono text-sm">
                  {showValue ? storedValue : "••••••••"}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleRotateKey}
                disabled={!storedValue}
              >
                <RefreshCw className="h-4 w-4" />
                Rotate Key
              </Button>
              <Button
                variant="destructive"
                onClick={removeValue}
                disabled={!storedValue}
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Raw Storage</CardTitle>
            <CardDescription>
              Encrypted data as stored in {storageType}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {rawStorage ? (
              <div className="space-y-2">
                <div className="rounded bg-muted p-3">
                  <pre className="overflow-auto text-xs">
                    {JSON.stringify(JSON.parse(rawStorage), null, 2)}
                  </pre>
                </div>
                <Alert>
                  <AlertDescription className="text-xs">
                    The stored data is encrypted. Even if someone accesses your
                    storage, they cannot read the value without the encryption
                    key.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No data stored yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>Automatic AES encryption/decryption</li>
            <li>Support for localStorage and sessionStorage</li>
            <li>Time-to-live (TTL) expiration support</li>
            <li>Key rotation for enhanced security</li>
            <li>Server-backed key retrieval (optional)</li>
            <li>Transparent API similar to useLocalStorage</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
