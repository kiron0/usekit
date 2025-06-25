"use client"

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { notifySuccess } from "@/components/toast"
import { usePagination } from "registry/hooks/use-pagination"

const sampleData = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
  description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
}))

const itemsPerPageOptions = [5, 10, 20, 50]

export default function UsePaginationDemo() {
  const [itemsPerPage, setItemsPerPage] = React.useState(10)

  const {
    totalPages,
    currentPage,
    nextPage,
    prevPage,
    goToPage,
    startIndex,
    endIndex,
    pageNumbers,
    canNextPage,
    canPreviousPage,
    hasPreviousEllipsis,
    hasNextEllipsis,
    totalItems,
  } = usePagination({
    totalItems: sampleData.length,
    itemsPerPage,
    initialPage: 1,
    maxVisiblePages: 3,
  })

  const currentItems = sampleData.slice(startIndex, endIndex)

  return (
    <div className="mx-auto w-full max-w-xl space-y-6">
      <h1 className="text-center text-xl font-bold">
        Pagination Demo (100 items)
      </h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell className="truncate">{item.name}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    notifySuccess({
                      title: `Item ${item.id} Details`,
                      description: item.description,
                    })
                  }
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-center gap-2">
        <span className="text-sm">Items per page:</span>
        <Select
          value={String(itemsPerPage)}
          onValueChange={(value) => {
            const newItemsPerPage = parseInt(value, 10)
            setItemsPerPage(newItemsPerPage)
          }}
        >
          <SelectTrigger className="w-20">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {itemsPerPageOptions.map((option) => (
              <SelectItem key={option} value={String(option)}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-center gap-2">
        <Button size="icon" onClick={prevPage} disabled={!canPreviousPage}>
          <ChevronLeftIcon />
        </Button>

        <div className="flex gap-1">
          {hasPreviousEllipsis && (
            <Button variant="outline" disabled>
              ...
            </Button>
          )}
          {pageNumbers.map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => goToPage(page)}
              disabled={currentPage === page}
            >
              {page}
            </Button>
          ))}
          {hasNextEllipsis && (
            <Button variant="outline" disabled>
              ...
            </Button>
          )}
        </div>

        <Button size="icon" onClick={nextPage} disabled={!canNextPage}>
          <ChevronRightIcon />
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Showing items {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
        {totalItems}
      </div>
    </div>
  )
}
