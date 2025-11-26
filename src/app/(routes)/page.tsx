import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Github } from "lucide-react"
import Balancer from "react-wrap-balancer"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { ChangingScrambleText } from "@/components/changing-scramble-text"
import { GridPattern } from "@/components/grid-pattern"

export const metadata: Metadata = {
  title: siteConfig.slogan,
  description: siteConfig.description,
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    type: "website",
    siteName: siteConfig.name,
    images: [
      {
        url: new URL("/og.png", siteConfig.url),
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: siteConfig.links.twitter,
    images: [new URL("/og.png", siteConfig.url)],
  },
}

export default function Home() {
  return (
    <div className="relative grid h-full flex-1 place-items-center overflow-hidden">
      <div className="z-10 flex flex-col items-center space-y-6">
        <div className="space-y-1 text-center">
          <ChangingScrambleText />
          <Balancer className="max-w-2xl px-4 text-sm text-muted-foreground md:text-lg">
            A collection of reusable react hooks that you can easily copy and
            paste into your apps or add directly through the shadcn CLI.
          </Balancer>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="https://github.com/kiron0/usekit"
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ variant: "secondary" })}
          >
            <Github className="size-4" />
            GitHub
          </Link>
          <Link href="/docs" className={buttonVariants({ variant: "default" })}>
            Get Started <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
      <GridPattern
        squares={[
          [5, 12],
          [6, 16],
          [3, 20],
          [8, 23],
          [2, 25],
          [15, 15],
          [17, 16],
          [20, 20],
          [13, 20],
          [25, 25],
          [16, 27],
        ]}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "-inset-y-1/2 inset-x-0 h-[200%] skew-y-12"
        )}
      />
    </div>
  )
}
