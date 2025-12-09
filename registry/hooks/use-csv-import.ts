import * as React from "react"

interface CsvImportOptions {
  delimiter?: string
  skipEmptyLines?: boolean
}

interface CsvImportResult<T> {
  headers: string[]
  rows: T[]
  errors: Map<number, string>
}

export function useCsvImport<T extends object>(
  file: File | null,
  options: CsvImportOptions = {}
) {
  const [result, setResult] = React.useState<CsvImportResult<T>>({
    headers: [],
    rows: [],
    errors: new Map(),
  })
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (!file) {
      setResult({ headers: [], rows: [], errors: new Map() })
      return
    }

    const parseCSV = async () => {
      setLoading(true)
      const errors = new Map<number, string>()
      let headers: string[] = []
      const rows: T[] = []

      try {
        const text = await file.text()
        const delimiter = options.delimiter ?? ","
        const lines = text.split(/\r?\n/)
        const skipEmpty = options.skipEmptyLines ?? true

        if (lines.length === 0) {
          setResult({ headers: [], rows: [], errors })
          setLoading(false)
          return
        }

        headers = lines[0]
          .replace(/^\uFEFF/, "")
          .split(delimiter)
          .map((h) => h.trim().replace(/^"|"$/g, ""))

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim()
          if (skipEmpty && !line) continue

          try {
            const values = line
              .split(delimiter)
              .map((v) => v.trim().replace(/^"|"$/g, ""))
            if (values.length !== headers.length) {
              errors.set(
                i + 1,
                `Column count mismatch: expected ${headers.length}, got ${values.length}`
              )
              continue
            }

            const row = {} as T
            headers.forEach((header, index) => {
              row[header as keyof T] = values[index] as T[keyof T]
            })
            rows.push(row)
          } catch (error) {
            errors.set(
              i + 1,
              error instanceof Error ? error.message : "Parse error"
            )
          }
        }
      } catch (error) {
        errors.set(
          0,
          error instanceof Error ? error.message : "File read error"
        )
      }

      setResult({ headers, rows, errors })
      setLoading(false)
    }

    parseCSV()
  }, [file, options.delimiter, options.skipEmptyLines])

  return { ...result, loading }
}
