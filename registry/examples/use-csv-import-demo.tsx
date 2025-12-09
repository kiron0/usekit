"use client"

import { useRef, useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCsvImport } from "registry/hooks/use-csv-import"
import { useDropZone } from "registry/hooks/use-dropzone"

interface CsvRow {
  name: string
  email: string
  age: string
}

export default function UseCsvImportDemo() {
  const [file, setFile] = useState<File | null>(null)
  const { headers, rows, errors, loading } = useCsvImport<CsvRow>(file, {
    delimiter: ",",
    skipEmptyLines: true,
  })
  const dropRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { files, isOverDropZone, clearFiles } = useDropZone(dropRef, {
    dataTypes: ["text/csv"],
    multiple: false,
    onDrop: (dropped) => {
      if (dropped && dropped.length > 0) {
        setFile(dropped[0])
      }
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      clearFiles()
    }
  }

  return (
    <div className="flex w-full flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">CSV Import</h2>
      </div>

      <div className="space-y-4">
        <div className="w-full space-y-4 text-center">
          <div
            ref={dropRef}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            className={cn(
              "mx-auto flex aspect-video h-40 w-full items-center justify-center rounded-2xl border-2 border-dashed p-4 transition",
              isOverDropZone
                ? "border-primary/70 bg-primary/5"
                : "border-muted-foreground/40 bg-muted/30"
            )}
          >
            {files ? (
              <p className="text-sm font-semibold">
                Dropped {files.length} file{files.length === 1 ? "" : "s"}
              </p>
            ) : isOverDropZone ? (
              <p className="text-sm font-semibold">Drop CSV here</p>
            ) : (
              <p className="text-sm font-semibold">
                Drag CSV here or click to choose
              </p>
            )}
            <Input
              ref={inputRef}
              id="csv-input"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="sr-only"
            />
          </div>

          {(files || file) && (
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Selected file:</p>
              <div className="mx-auto max-w-md space-y-1">
                {files?.map((f) => (
                  <p key={f.name} className="truncate">
                    {f.name}
                  </p>
                ))}
                {!files && file && (
                  <p key={file.name} className="truncate">
                    {file.name}
                  </p>
                )}
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  clearFiles()
                  setFile(null)
                  if (inputRef.current) inputRef.current.value = ""
                }}
              >
                Clear / Reset
              </Button>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Expected columns: name, email, age
          </p>
        </div>

        {loading && (
          <div className="text-sm text-muted-foreground">Parsing CSV...</div>
        )}

        {errors.size > 0 && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:bg-red-950">
            <h3 className="mb-2 font-semibold text-red-800 dark:text-red-200">
              Errors ({errors.size})
            </h3>
            <ul className="space-y-1 text-sm text-red-700 dark:text-red-300">
              {Array.from(errors.entries()).map(([line, error]) => (
                <li key={line}>
                  Line {line}: {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {rows.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Imported Rows ({rows.length})</h3>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted">
                    {(headers.length ? headers : ["name", "email", "age"]).map(
                      (header) => (
                        <th key={header} className="px-4 py-2 text-left">
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 10).map((row, index) => (
                    <tr key={index} className="border-b">
                      {(headers.length
                        ? headers
                        : (["name", "email", "age"] as (keyof CsvRow)[])
                      ).map((header) => (
                        <td key={String(header)} className="px-4 py-2">
                          {row[header as keyof CsvRow] as string}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {rows.length > 10 && (
              <p className="text-sm text-muted-foreground">
                Showing first 10 of {rows.length} rows
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
