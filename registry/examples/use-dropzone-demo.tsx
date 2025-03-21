"use client"

import { useRef } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useDropZone } from "registry/hooks/use-dropzone"

export default function UseDropzoneDemo() {
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const { files, clearFiles, isOverDropZone } = useDropZone(dropZoneRef, {
    onDrop: (files) => {
      console.log("Dropped files:", files)
    },
  })

  return (
    <div className="space-y-4 text-center">
      <div
        ref={dropZoneRef}
        className={cn(
          "mx-auto flex h-40 w-[calc(100vw-5rem)] items-center justify-center rounded-2xl border-2 border-dashed p-4 md:w-80",
          isOverDropZone
            ? "border-blue-500 bg-neutral-400/0"
            : "border-neutral-500 bg-neutral-400/15"
        )}
      >
        {files ? (
          <p>Dropped {files.length} files</p>
        ) : isOverDropZone ? (
          <p>Drop files here</p>
        ) : (
          <p>Drag files here</p>
        )}
      </div>
      {files && (
        <>
          <p>Here is the filenames dropped:</p>
          <ul>{files?.map((file) => <li key={file.name}>{file.name}</li>)}</ul>
          <Button variant="destructive" onClick={clearFiles}>
            Clear files
          </Button>
        </>
      )}
    </div>
  )
}
