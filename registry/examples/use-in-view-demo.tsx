"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import useInView from "registry/hooks/use-in-view"

export default function UseViewInDemo() {
  const ref1 = React.useRef<HTMLDivElement | null>(null)
  const ref2 = React.useRef<HTMLDivElement | null>(null)
  const ref3 = React.useRef<HTMLDivElement | null>(null)

  const isInView1 = useInView(ref1)
  const isInView2 = useInView(ref2, { threshold: 0.5 })
  const isInView3 = useInView(ref3, { rootMargin: "100px" })

  return (
    <div className="max-h-96 w-full space-y-8 overflow-auto p-4 text-secondary-foreground/50">
      <ScreenDiv value="down" />
      <div className="space-y-4">
        {[ref1, ref2, ref3].map((ref, index) => (
          <div
            key={`element-${index}`}
            ref={ref}
            className={cn(
              "rounded-2xl border p-4 transition-all duration-1000",
              (index === 0 && isInView1) ||
                (index === 1 && isInView2) ||
                (index === 2 && isInView3)
                ? "border-green-500/20 bg-emerald-300/20 text-emerald-600 dark:text-emerald-300"
                : "border-rose-500/20 bg-red-300/20 text-rose-600 dark:text-rose-300"
            )}
          >
            <h2 className="mb-2 text-lg font-semibold tracking-tight">
              Element {index + 1}{" "}
              {(index === 0 && isInView1) ||
              (index === 1 && isInView2) ||
              (index === 2 && isInView3)
                ? "is"
                : "is not"}{" "}
              in view
            </h2>
            <p>
              {index === 0 && "Default options"}
              {index === 1 && "With threshold: 0.5"}
              {index === 2 && "With rootMargin: 100px"}
            </p>
          </div>
        ))}
      </div>
      <ScreenDiv value="up" />
    </div>
  )
}

function ScreenDiv({ value }: { value: string }) {
  return (
    <div className="flex h-screen items-center justify-center rounded-2xl bg-secondary/50 p-20 tracking-tighter">
      <p className="text-xl">Scroll {value} to see the elements change</p>
    </div>
  )
}
