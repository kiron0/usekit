"use client"

import * as React from "react"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Props {
  value: string | undefined
  onChange: (value: string) => void
  options: { label: string; value: string }[]
  selectText?: string
  searchText?: string
  disabled?: boolean
}

export function SelectSearch({
  value,
  onChange,
  options,
  selectText,
  searchText,
  disabled,
}: Props) {
  const id = React.useId()
  const [open, setOpen] = React.useState<boolean>(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between border-input bg-transparent px-3 font-normal capitalize outline-none outline-offset-0 hover:bg-transparent focus-visible:outline-[3px]"
          disabled={disabled}
        >
          <span className={cn("truncate", !value && "text-muted-foreground")}>
            {value ? (
              options.find((option) => option.value === value)?.label
            ) : (
              <span className="normal-case">
                {selectText ?? "Select an option"}
              </span>
            )}
          </span>
          <ChevronDownIcon
            size={16}
            className="shrink-0 text-muted-foreground/80"
            aria-hidden="true"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full min-w-[var(--radix-popper-anchor-width)] border-input p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder={searchText ?? "Search..."} />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                  className="capitalize"
                >
                  {option.label}
                  {value === option.value && (
                    <CheckIcon size={16} className="ml-auto" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
