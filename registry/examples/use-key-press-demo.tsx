"use client"

import * as React from "react"
import { MoveDown, MoveLeft, MoveRight, MoveUp } from "lucide-react"

import { cn } from "@/lib/utils"
import { useKeyPress } from "registry/hooks/use-key-press"

type Direction = "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight"

export default function KeyPressDemo() {
  const [activeKey, setActiveKey] = React.useState<Direction | "">("")

  const handleKeyPress = React.useCallback((e: KeyboardEvent) => {
    e.preventDefault()
    setActiveKey(e.key as Direction)
    setTimeout(() => setActiveKey(""), 600)
  }, [])

  useKeyPress("ArrowRight", handleKeyPress)
  useKeyPress("ArrowLeft", handleKeyPress)
  useKeyPress("ArrowUp", handleKeyPress)
  useKeyPress("ArrowDown", handleKeyPress)

  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-3 mx-auto">
          <button
            className={cn(
              "flex h-[45px] w-[48px] items-center justify-center rounded-[5px] pb-[3px] opacity-80",
              activeKey === "ArrowUp"
                ? "border-t-destructive bg-destructive text-destructive-foreground [box-shadow:0px_3px_0px_2px_rgba(239,_68,_68,_0.7)]"
                : "border-t-primary bg-zinc-800 text-white [box-shadow:0px_3px_0px_2px_rgba(39,_39,_42,_0.8)] dark:border-t-[1px_solid_rgba(249,_244,_218,_0.8)] dark:bg-[#f9f4da] dark:text-black dark:[box-shadow:0px_3px_0px_2px_rgba(249,_244,_218,_0.8)]"
            )}
          >
            <MoveUp />
          </button>
        </div>
        <button
          className={cn(
            "flex h-[45px] w-[48px] items-center justify-center rounded-[5px] pb-[3px] opacity-80",
            activeKey === "ArrowLeft"
              ? "border-t-destructive bg-destructive text-destructive-foreground [box-shadow:0px_3px_0px_2px_rgba(239,_68,_68,_0.7)]"
              : "border-t-primary bg-zinc-800 text-white [box-shadow:0px_3px_0px_2px_rgba(39,_39,_42,_0.8)] dark:border-t-[1px_solid_rgba(249,_244,_218,_0.8)] dark:bg-[#f9f4da] dark:text-black dark:[box-shadow:0px_3px_0px_2px_rgba(249,_244,_218,_0.8)]"
          )}
        >
          <MoveLeft className="mt-2" />
        </button>
        <button
          className={cn(
            "flex h-[45px] w-[48px] items-center justify-center rounded-[5px] pb-[3px] opacity-80",
            activeKey === "ArrowDown"
              ? "border-t-destructive bg-destructive text-destructive-foreground [box-shadow:0px_3px_0px_2px_rgba(239,_68,_68,_0.7)]"
              : "border-t-primary bg-zinc-800 text-white [box-shadow:0px_3px_0px_2px_rgba(39,_39,_42,_0.8)] dark:border-t-[1px_solid_rgba(249,_244,_218,_0.8)] dark:bg-[#f9f4da] dark:text-black dark:[box-shadow:0px_3px_0px_2px_rgba(249,_244,_218,_0.8)]"
          )}
        >
          <MoveDown />
        </button>
        <button
          className={cn(
            "flex h-[45px] w-[48px] items-center justify-center rounded-[5px] pb-[3px] opacity-80",
            activeKey === "ArrowRight"
              ? "border-t-destructive bg-destructive text-destructive-foreground [box-shadow:0px_3px_0px_2px_rgba(239,_68,_68,_0.7)]"
              : "border-t-primary bg-zinc-800 text-white [box-shadow:0px_3px_0px_2px_rgba(39,_39,_42,_0.8)] dark:border-t-[1px_solid_rgba(249,_244,_218,_0.8)] dark:bg-[#f9f4da] dark:text-black dark:[box-shadow:0px_3px_0px_2px_rgba(249,_244,_218,_0.8)]"
          )}
        >
          <MoveRight className="mt-2" />
        </button>
      </div>
      {activeKey && (
        <p>{activeKey.replace(/([a-z])([A-Z])/g, "$1 $2")} key pressed!</p>
      )}
      <p>Press any arrow key on your keyboard</p>
    </div>
  )
}
