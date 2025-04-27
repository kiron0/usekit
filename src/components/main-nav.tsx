"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Logo from "@/assets/logo.png"
import { useTheme } from "next-themes"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

export function MainNav() {
  const { theme } = useTheme()
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-4 flex items-center gap-2 lg:mr-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={Logo.src}
          alt="Logo"
          width={Logo.width}
          height={Logo.height}
          className={cn(
            "w-8",
            theme?.includes("dark") ? "invert" : "dark:invert"
          )}
        />
        <span className="hidden font-bold lg:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      <nav className="flex items-center gap-4 text-sm xl:gap-6">
        <Link
          href="/docs"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/docs" ? "text-foreground" : "text-foreground/80"
          )}
        >
          Docs
        </Link>
      </nav>
    </div>
  )
}
