"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"

import { docsConfig } from "@/config/docs"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

export function MainNav() {
  const { theme } = useTheme()
  const pathname = usePathname()
  const navItems = docsConfig.mainNav.filter(
    (item) => item.href && item.href !== "/"
  )

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-4 flex items-center gap-2 lg:mr-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="Logo"
          className={cn(
            "w-7",
            theme?.includes("dark") ? "invert" : "dark:invert"
          )}
        />
        <span className="hidden font-bold lg:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      <nav className="flex items-center gap-4 text-sm xl:gap-6">
        {navItems.map((item) => {
          const href = item.href as string
          const isActive =
            href === "/docs"
              ? pathname === "/docs"
              : pathname === href || pathname.startsWith(`${href}/`)

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "transition-colors",
                isActive
                  ? "text-foreground"
                  : "text-foreground/80 hover:text-foreground"
              )}
            >
              {item.title}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
