"use client"

import * as React from "react"
import { useId } from "react"
import { format } from "date-fns"
import { CalendarIcon, ClockIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  currentDate: Date | undefined
  onUpdateDate: (date: Date | undefined) => void
}

export function DatePicker({ currentDate, onUpdateDate }: DatePickerProps) {
  const id = useId()
  const [time, setTime] = React.useState<string>("12:00:00")

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = event.target.value
    setTime(newTime)

    if (currentDate) {
      const [hours, minutes, seconds] = newTime.split(":").map(Number)
      const updatedDate = new Date(currentDate)
      updatedDate.setHours(hours, minutes, seconds)
      onUpdateDate(updatedDate)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant={"outline"}
          className={cn(
            "group w-full justify-between border-input bg-background px-3 font-normal outline-none outline-offset-0 hover:bg-background focus-visible:outline-[3px]",
            !currentDate && "text-muted-foreground"
          )}
        >
          <span
            className={cn("truncate", !currentDate && "text-muted-foreground")}
          >
            {currentDate ? format(currentDate, "PPP") : "Pick a date"}
          </span>
          <CalendarIcon
            size={16}
            className="shrink-0 text-muted-foreground/80 transition-colors group-hover:text-foreground"
            aria-hidden="true"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="start">
        <div>
          <Calendar
            mode="single"
            selected={currentDate}
            onSelect={onUpdateDate}
          />
          <div className="w-full border-t p-3">
            <div className="relative grow">
              <Input
                type="time"
                step="1"
                value={time}
                onChange={handleTimeChange}
                className="peer appearance-none ps-9 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                <ClockIcon size={16} aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
