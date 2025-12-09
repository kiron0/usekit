import * as React from "react"

interface Column<T> {
  key: keyof T
  header: string
  accessor?: (row: T) => string | number
}

export function useTableExportCSV<T extends object>() {
  const exportCSV = React.useCallback(
    (rows: T[], columns: Column<T>[], filename: string = "export.csv") => {
      if (columns.length === 0) {
        console.warn("No columns provided for export")
        return
      }

      const headers = columns.map((col) => col.header).join(",")
      const csvRows =
        rows.length === 0
          ? []
          : rows.map((row) =>
              columns
                .map((col) => {
                  const value = col.accessor
                    ? col.accessor(row)
                    : ((row[col.key] as unknown as string | number) ?? "")
                  const stringValue = String(value ?? "").replace(/"/g, '""')
                  return `"${stringValue}"`
                })
                .join(",")
            )

      const csvContent = [headers, ...csvRows].join("\n")
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)

      link.setAttribute("href", url)
      link.setAttribute(
        "download",
        filename.endsWith(".csv") ? filename : `${filename}.csv`
      )
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    },
    []
  )

  return { exportCSV }
}
