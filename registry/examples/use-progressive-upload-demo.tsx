"use client"

import * as React from "react"
import {
  AlertCircle,
  CheckCircle2,
  File,
  Pause,
  Play,
  Upload,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useDropZone } from "registry/hooks/use-dropzone"
import { useProgressiveUpload } from "registry/hooks/use-progressive-upload"

const MOCK_ENDPOINT = "/api/upload"

function createMockUploadHandler() {
  const originalFetch = window.fetch
  const uploadSessions = new Map<string, { chunks: Set<number> }>()

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    let url: string
    if (typeof input === "string") {
      url = input
    } else if (input instanceof URL) {
      url = input.href
    } else if (input instanceof Request) {
      url = input.url
    } else {
      return originalFetch(input, init)
    }

    const method = input instanceof Request ? input.method : init?.method
    const body = input instanceof Request ? input.body : init?.body

    if (
      url.includes(MOCK_ENDPOINT) &&
      method === "POST" &&
      body instanceof FormData
    ) {
      const formData = body
      const fileId = formData.get("fileId") as string
      const chunkIndex = parseInt(formData.get("chunkIndex") as string, 10)
      const totalChunks = parseInt(formData.get("totalChunks") as string, 10)

      if (!uploadSessions.has(fileId)) {
        uploadSessions.set(fileId, { chunks: new Set() })
      }

      const session = uploadSessions.get(fileId)!

      const delay = Math.random() * 400 + 100

      const shouldFail = Math.random() < 0.05 && chunkIndex > 0

      await new Promise((resolve) => setTimeout(resolve, delay))

      if (shouldFail && !session.chunks.has(chunkIndex)) {
        return new Response(null, { status: 500, statusText: "Network error" })
      }

      session.chunks.add(chunkIndex)

      return new Response(
        JSON.stringify({
          success: true,
          chunkIndex,
          uploadedChunks: Array.from(session.chunks).length,
          totalChunks,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    return originalFetch(input, init)
  }

  return () => {
    window.fetch = originalFetch
    uploadSessions.clear()
  }
}

export default function UseProgressiveUploadDemo() {
  const [file, setFile] = React.useState<File | null>(null)
  const dropZoneRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const cleanup = createMockUploadHandler()
    return cleanup
  }, [])

  const { isOverDropZone } = useDropZone(dropZoneRef, {
    onDrop: (files) => {
      if (!file && files && files.length > 0) {
        setFile(files[0])
      }
    },
    multiple: false,
  })

  const {
    start,
    pause,
    resume,
    progress: uploadProgress,
    isUploading,
    isPaused,
    error,
  } = useProgressiveUpload(file, {
    endpoint: MOCK_ENDPOINT,
    chunkSize: 256 * 1024, // 256KB
    minChunkSize: 64 * 1024, // 64KB
    maxChunkSize: 2 * 1024 * 1024, // 2MB
    maxRetries: 3,
    persistState: true,
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!file) {
      const selectedFile = e.target.files?.[0]
      if (selectedFile) {
        setFile(selectedFile)
      }
    }
    e.target.value = ""
  }

  const handleClear = () => {
    setFile(null)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-4">
        <div
          ref={dropZoneRef}
          className={cn(
            "group relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors",
            isOverDropZone && !file
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 bg-muted/30",
            !file && !isUploading && "hover:border-muted-foreground/50",
            file && "border-solid border-primary/50 bg-primary/5",
            (file || isUploading) && "pointer-events-none opacity-60"
          )}
        >
          <input
            id="file-input"
            type="file"
            onChange={handleFileChange}
            disabled={isUploading || !!file}
            className={cn(
              "absolute inset-0 h-full w-full opacity-0",
              !file && !isUploading && "cursor-pointer"
            )}
          />

          {!file ? (
            <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
              <div
                className={cn(
                  "rounded-full bg-muted p-4 transition-transform",
                  isOverDropZone && "scale-110"
                )}
              >
                <Upload
                  className={cn(
                    "h-8 w-8 text-muted-foreground transition-colors",
                    isOverDropZone && "text-primary"
                  )}
                />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  {isOverDropZone ? "Drop file here" : "Drag & drop a file"}
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports any file type
                </p>
              </div>
            </div>
          ) : (
            <div className="pointer-events-auto flex w-full items-center gap-4 p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <File className="h-6 w-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
              {!isUploading && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClear()
                  }}
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>

        {file && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Upload progress</span>
                <span className="font-mono">{Math.round(uploadProgress)}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {formatFileSize((file.size * uploadProgress) / 100)} /{" "}
                {formatFileSize(file.size)}
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}

            {uploadProgress === 100 && !error && (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Upload completed successfully!
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              {!isUploading && !isPaused && (
                <Button onClick={start} disabled={!file}>
                  <Upload className="h-4 w-4" />
                  Start Upload
                </Button>
              )}

              {isUploading && !isPaused && (
                <Button onClick={pause} variant="outline">
                  <Pause className="h-4 w-4" />
                  Pause
                </Button>
              )}

              {isPaused && (
                <Button onClick={resume}>
                  <Play className="h-4 w-4" />
                  Resume
                </Button>
              )}

              <Button
                variant="outline"
                onClick={handleClear}
                disabled={isUploading}
              >
                Clear
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2 rounded-md border bg-muted/30 p-4 text-sm">
        <p className="font-medium">Features</p>
        <ul className="list-inside list-disc space-y-1 text-muted-foreground">
          <li>Chunked upload for large files</li>
          <li>Automatic chunk size adaptation based on network conditions</li>
          <li>Resume from last successful chunk</li>
          <li>Pause and resume functionality</li>
          <li>Automatic retry on failure</li>
          <li>Progress tracking</li>
        </ul>
        <p className="mt-2 text-xs text-muted-foreground">
          This demo uses a fully functional mock upload system that simulates
          chunked uploads with realistic network delays and occasional failures
          to demonstrate retry functionality. In production, replace with your
          actual upload endpoint that handles chunked uploads.
        </p>
      </div>
    </div>
  )
}
