import { cookies } from "next/headers"
import NextTopLoader from "nextjs-toploader"

import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ActiveThemeProvider } from "@/components/active-theme"

import { ThemeProvider } from "./theme-provider"

interface ProvidersProps {
  children: React.ReactNode
}

export default async function Providers({ children }: ProvidersProps) {
  const cookieStore = await cookies()
  const activeThemeValue = cookieStore.get("active_theme")?.value

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <ActiveThemeProvider initialTheme={activeThemeValue}>
        <TooltipProvider>
          <div className="bg-background relative flex min-h-svh flex-col">
            {children}
          </div>
        </TooltipProvider>
      </ActiveThemeProvider>
      <Toaster />
      <NextTopLoader showForHashAnchor={false} />
    </ThemeProvider>
  )
}
