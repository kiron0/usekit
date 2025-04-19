"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BugIcon, LightbulbIcon, type LucideProps } from "lucide-react"

interface ContributeProps {
  slug: string
}

interface ContributeLink {
  text: string
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >
  href: string
}

export function Contribute({ slug }: ContributeProps) {
  const pathname = usePathname()

  const hookName = React.useMemo(() => {
    const parts = slug.split("/")
    const hookName = parts[parts.length - 1]
    return hookName
  }, [slug])

  const contributeLinks = React.useMemo<ContributeLink[]>(() => {
    return [
      {
        text: "Report an issue",
        icon: BugIcon,
        href: `/docs/report?h=${hookName}`,
      },
      {
        text: "Request a feature",
        icon: LightbulbIcon,
        href: "/docs/feature",
      },
    ]
  }, [hookName])

  if (!pathname.startsWith("/docs/hooks/")) {
    return null
  }

  return (
    <div className="space-y-2">
      <p className="font-medium">Contribute</p>
      <ul className="m-0 list-none">
        {contributeLinks.map((link, index) => (
          <li key={index} className="mt-0 pt-2">
            <Link
              href={link.href}
              className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <link.icon className="mr-2 size-4" />
              {link.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
