"use client"

import Link from "next/link"
import { AlertTriangleIcon, ChevronLeftIcon, HouseIcon } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"

import { Button, buttonVariants } from "@/components/ui/button"

export function NotFound() {
  const router = useRouter()

  return (
    <div className="container mx-auto flex h-[calc(100vh-3.5rem)] items-center px-6 py-12">
      <div className="mx-auto w-full max-w-md text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-full bg-destructive/20 blur-xl" />
            <div className="relative rounded-full bg-gradient-to-br from-destructive/10 to-destructive/5 p-4 ring-2 ring-destructive/20">
              <AlertTriangleIcon className="size-12 text-destructive" />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              404
            </span>
          </h1>
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
            Page not found
          </h2>
          <p className="mx-auto max-w-sm text-base text-muted-foreground sm:text-lg">
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button onClick={() => router.back()}>
            <ChevronLeftIcon className="size-4" />
            Go back
          </Button>
          <Link
            href="/"
            className={buttonVariants({
              variant: "outline",
            })}
          >
            <HouseIcon className="size-4" />
            Take me home
          </Link>
        </div>
      </div>
    </div>
  )
}
