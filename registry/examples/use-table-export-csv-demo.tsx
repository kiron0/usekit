"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { useTableExportCSV } from "registry/hooks/use-table-export-csv"

interface Product {
  id: number
  name: string
  price: number
  category: string
}

export default function UseTableExportCSVDemo() {
  const { exportCSV } = useTableExportCSV<Product>()
  const [products] = useState<Product[]>([
    { id: 1, name: "Laptop", price: 999.99, category: "Electronics" },
    { id: 2, name: "Mouse", price: 29.99, category: "Accessories" },
    { id: 3, name: "Keyboard", price: 79.99, category: "Accessories" },
    { id: 4, name: "Monitor", price: 299.99, category: "Electronics" },
  ])

  const columns = [
    { key: "id" as const, header: "ID" },
    { key: "name" as const, header: "Product Name" },
    {
      key: "price" as const,
      header: "Price",
      accessor: (row: Product) => `$${row.price.toFixed(2)}`,
    },
    { key: "category" as const, header: "Category" },
  ]

  const handleExport = () => {
    exportCSV(products, columns, "products-export")
  }

  return (
    <div className="flex w-full flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Table Export CSV</h2>
        <Button onClick={handleExport}>Export to CSV</Button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted">
              {columns.map((col) => (
                <th key={String(col.key)} className="px-4 py-2 text-left">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="px-4 py-2">{product.id}</td>
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">${product.price.toFixed(2)}</td>
                <td className="px-4 py-2">{product.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg bg-muted p-4">
        <p className="text-sm text-muted-foreground">
          Click &quot;Export to CSV&quot; to download the table data as a CSV
          file.
        </p>
      </div>
    </div>
  )
}
