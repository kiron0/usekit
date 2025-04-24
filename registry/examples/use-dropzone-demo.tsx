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
          "mx-auto flex aspect-video h-40 max-w-full items-center justify-center rounded-2xl border-2 border-dashed p-4",
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
          <div className="mx-auto mb-4 w-2/3">
            {files?.map((file) => (
              <p key={file.name} className="truncate">
                {file.name}
              </p>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {files.length > 0 &&
              files.map(
                (file, i) =>
                  file.type.startsWith("image/") && (
                    <img
                      key={i}
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      width={1080}
                      height={1080}
                      className="aspect-square size-full rounded-lg object-cover ring ring-primary"
                    />
                  )
              )}
          </div>
          <Button variant="destructive" onClick={clearFiles}>
            Clear files
          </Button>
        </>
      )}
    </div>
  )
}
