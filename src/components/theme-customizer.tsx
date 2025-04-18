"use client"

import * as React from "react"
import {
  CheckIcon,
  MoonIcon,
  PaletteIcon,
  RepeatIcon,
  SunIcon,
} from "lucide-react"
import { useTheme } from "next-themes"

import { baseColors } from "@/config/colors"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"

import { useThemeConfig } from "./active-theme"

export function ThemeCustomizer() {
  return (
    <>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="ghost" className="md:hidden" size="icon">
            <PaletteIcon />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <p className="sr-only">Theme Customizer</p>
          <Customizer />
        </DrawerContent>
      </Drawer>
      <div className="hidden items-center md:flex">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <PaletteIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="z-999 w-[340px] rounded-[12px] p-6"
            sideOffset={10}
          >
            <Customizer />
          </PopoverContent>
        </Popover>
      </div>
    </>
  )
}

export function Customizer() {
  const { activeTheme, setActiveTheme } = useThemeConfig()
  const [mounted, setMounted] = React.useState(false)
  const { setTheme, resolvedTheme: theme } = useTheme()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="w-full p-4 md:p-0">
      <div className="flex items-start py-4 md:pt-0">
        <div className="space-y-1 pr-2">
          <p className="leading-none font-semibold tracking-tight">Customize</p>
          <p className="text-muted-foreground text-xs">
            Pick a style and color for the website.
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto rounded-[0.5rem]"
          onClick={() => {
            setActiveTheme("default")
            setTheme("system")
          }}
        >
          <RepeatIcon />
          <span className="sr-only">Reset</span>
        </Button>
      </div>
      <div className="flex flex-1 flex-col space-y-4 md:space-y-6">
        <div className="space-y-1.5">
          <Label className="text-xs">Color</Label>
          <div className="grid grid-cols-3 gap-2">
            {baseColors.map((color) => {
              const isActive = activeTheme === color.name

              return mounted ? (
                <Button
                  variant="outline"
                  size="sm"
                  key={color.name}
                  onClick={() => setActiveTheme(color.name)}
                  className={cn(
                    "justify-start border-2",
                    isActive && "border-primary"
                  )}
                  style={
                    {
                      "--theme-primary": `hsl(${
                        color?.activeColor[theme === "dark" ? "dark" : "light"]
                      })`,
                    } as React.CSSProperties
                  }
                >
                  <span className="flex min-h-4 min-w-4 items-center justify-center rounded-full bg-[var(--theme-primary)]">
                    {isActive && <CheckIcon className="size-4 text-white" />}
                  </span>
                  {color.label}
                </Button>
              ) : (
                <Skeleton className="h-8 w-full" key={color.name} />
              )
            })}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Mode</Label>
          <div className="grid grid-cols-3 gap-2">
            {mounted ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setTheme(
                      theme === "dark"
                        ? "light"
                        : theme?.includes("dark")
                          ? theme?.replace("dark-", "")
                          : `${theme}`
                    )
                  }
                  className={cn(
                    !theme?.includes("dark") && "border-primary border-2"
                  )}
                >
                  <SunIcon />
                  Light
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setTheme(
                      theme === "light"
                        ? "dark"
                        : theme?.includes("dark")
                          ? theme
                          : `dark-${theme}`
                    )
                  }
                  className={cn(
                    theme?.includes("dark") && "border-primary border-2"
                  )}
                >
                  <MoonIcon />
                  Dark
                </Button>
              </>
            ) : (
              <>
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
