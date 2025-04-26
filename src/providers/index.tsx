"use client"

import { Analytics } from "@vercel/analytics/next"
import NextTopLoader from "nextjs-toploader"

import { THEMES } from "@/config/colors"
import { siteConfig } from "@/config/site"
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"
import { usePreventZoom } from "registry/hooks/use-prevent-zoom"

import { ThemeProvider } from "./theme-provider"

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  usePreventZoom()

  return (
    <>
      <ThemeProvider
        themes={THEMES}
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        <TooltipProvider>
          <div className="relative flex min-h-svh flex-col bg-background">
            {children}
            {siteConfig.env.node === "production" && <Analytics />}
          </div>
          <Toaster />
          <NextTopLoader showForHashAnchor={false} />
        </TooltipProvider>
      </ThemeProvider>
    </>
  )
}
