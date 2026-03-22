import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  Blocks,
  Command,
  Copy,
  Github,
  Layers3,
  ShieldCheck,
  Sparkles,
  Terminal,
  Workflow,
} from "lucide-react"
import Balancer from "react-wrap-balancer"

import { docsConfig } from "@/config/docs"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { ChangingScrambleText } from "@/components/changing-scramble-text"
import { DocGridPattern } from "@/components/doc-grid-pattern"

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

const hooksSection = docsConfig.sidebarNav.find(
  (section) => section.title === "Hooks"
)
const hookItems = hooksSection?.items ?? []
const hookCount = hookItems.length

const stats = [
  {
    value: `${hookCount}+`,
    label: "hooks ready to copy or install",
  },
  {
    value: "CLI",
    label: "registry access through `uselab`",
  },
  {
    value: "TS",
    label: "TypeScript-first patterns throughout",
  },
]

const platformPillars = [
  {
    icon: Copy,
    title: "Copy-paste first",
    description:
      "Use the registry as a source of clean patterns instead of another runtime dependency to drag through every app.",
  },
  {
    icon: Command,
    title: "CLI when speed matters",
    description:
      "Pull hooks straight into a project with `uselab` when you want faster setup, repeatability, and less manual wiring.",
  },
  {
    icon: ShieldCheck,
    title: "Built for real product work",
    description:
      "The collection leans toward browser APIs, async control, state ergonomics, and UI behaviors teams reach for repeatedly.",
  },
]

const featuredHooks = [
  {
    slug: "use-dependency-graph",
    category: "Architecture",
    description:
      "Track relationships between values and surface how state flows through more complex interactions.",
  },
  {
    slug: "use-console-capture",
    category: "Debugging",
    description:
      "Capture console activity inside interfaces where logs need to stay visible to users or testers.",
  },
  {
    slug: "use-optimistic-queue",
    category: "Async UX",
    description:
      "Queue optimistic updates with rollback-friendly behavior for interfaces that need to feel immediate.",
  },
  {
    slug: "use-network-status",
    category: "Platform",
    description:
      "Bridge browser connectivity into React state so online and offline behavior is explicit.",
  },
  {
    slug: "use-form",
    category: "Forms",
    description:
      "Handle field state with a reusable pattern that is easier to transplant than a full form framework.",
  },
  {
    slug: "use-copy-to-clipboard",
    category: "Utilities",
    description:
      "Ship small, polished interaction wins without re-solving the browser edge cases every time.",
  },
].map((item) => {
  const href = `/docs/hooks/${item.slug}`
  const match = hookItems.find((hook) => hook.href === href)

  return {
    ...item,
    href,
    title:
      match?.title ??
      item.slug.replace(/(^|-)./g, (value) =>
        value.replace("-", "").toUpperCase()
      ),
    label: match?.label,
  }
})

const workflow = [
  {
    icon: Layers3,
    title: "Find the right primitive",
    description:
      "Browse the registry by problem space and scan hooks that already solve the awkward pieces of browser and UI state.",
  },
  {
    icon: Terminal,
    title: "Install or inspect quickly",
    description:
      "Use the CLI for speed, or read the docs and source directly when you want a pattern you can reshape for your own stack.",
  },
  {
    icon: Workflow,
    title: "Adapt without lock-in",
    description:
      "Keep only the code you need, rename it, trim it, and let it become part of the application instead of another abstraction layer.",
  },
]

export default function Home() {
  return (
    <div className="relative isolate flex-1 overflow-hidden">
      <DocGridPattern />

      <section className="border-grid border-b border-border/60">
        <div className="container grid gap-10 py-12 sm:py-14 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-14 lg:py-24">
          <div className="space-y-8">
            <div className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-2xl border border-border/60 bg-background/85 px-3 py-2 shadow-sm backdrop-blur sm:w-fit sm:rounded-full sm:px-4">
              <span className="hidden rounded-full bg-foreground px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-background sm:flex">
                Live registry
              </span>
              <span className="text-sm text-muted-foreground">
                Spotlighting
              </span>
              <ChangingScrambleText className="h-5 max-w-full break-all text-sm font-semibold sm:break-normal md:h-5 md:text-sm" />
            </div>

            <div className="space-y-5">
              <Balancer
                as="h1"
                className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
              >
                Production-ready React hooks you can copy, adapt, and ship.
              </Balancer>
              <Balancer className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-lg">
                useKit turns reusable React hooks into a toolkit you can browse,
                copy, or install fast. The goal is simple: fewer throwaway
                utilities, less package churn, and cleaner patterns getting into
                production faster.
              </Balancer>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/docs"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "w-full rounded-full px-6 shadow-lg shadow-foreground/10 sm:w-auto"
                )}
              >
                Get started <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/docs/cli"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full rounded-full border-border/70 bg-background/80 px-6 sm:w-auto"
                )}
              >
                Open CLI Guide <ArrowUpRight className="size-4" />
              </Link>
              <Link
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                  "w-full rounded-full px-4 sm:w-auto"
                )}
              >
                <Github className="size-4" />
                GitHub
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-border/60 bg-background/80 p-4 shadow-sm backdrop-blur"
                >
                  <p className="text-xl font-semibold tracking-tight sm:text-2xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative max-w-full">
            <div className="absolute -left-8 top-10 hidden h-32 w-32 rounded-full bg-amber-400/20 blur-3xl dark:bg-amber-300/10 sm:block" />
            <div className="absolute -right-6 bottom-6 hidden h-36 w-36 rounded-full bg-sky-400/20 blur-3xl dark:bg-sky-300/10 sm:block" />

            <div className="relative overflow-hidden rounded-[1.75rem] border border-border/60 bg-background/85 p-5 shadow-2xl shadow-foreground/5 backdrop-blur sm:rounded-[2rem] sm:p-6 md:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-muted-foreground">
                    Faster path to shipped code
                  </p>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                    Use the docs as a catalog and the CLI as a shortcut.
                  </h2>
                </div>
                <div className="hidden rounded-full border border-border/60 p-3 text-muted-foreground sm:flex">
                  <Blocks className="size-5" />
                </div>
              </div>

              <div className="mt-6 rounded-[1.5rem] border p-4 text-zinc-50 shadow-sm shadow-foreground/5 sm:p-5">
                <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <Sparkles className="size-3.5" />
                  Registry install
                </div>
                <code className="block overflow-x-auto break-all font-mono text-xs leading-7 text-foreground sm:text-[15px]">
                  npx uselab@latest add use-network-status
                </code>
                <p className="mt-4 text-sm leading-6 text-foreground">
                  Pull a hook into your project, inspect the code, and keep only
                  the pieces that deserve to stay.
                </p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.35rem] border border-border/60 bg-muted/40 p-4">
                  <p className="text-sm font-medium">What you get</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    You stop rebuilding the same browser wrappers and state
                    helpers under deadline pressure.
                  </p>
                </div>
                <div className="rounded-[1.35rem] border border-border/60 bg-muted/40 p-4">
                  <p className="text-sm font-medium">Why it matters</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Hooks stay editable, readable, and close to the product code
                    that depends on them.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-[1.35rem] border border-border/60 bg-background/70 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-medium">Starter paths</p>
                  <span className="text-xs text-muted-foreground">
                    docs + CLI + source
                  </span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <Link
                    href="/docs/installation"
                    className="rounded-2xl border border-border/60 bg-muted/35 p-3 text-sm transition-colors hover:bg-muted/60"
                  >
                    Installation
                  </Link>
                  <Link
                    href="/docs/hooks"
                    className="rounded-2xl border border-border/60 bg-muted/35 p-3 text-sm transition-colors hover:bg-muted/60"
                  >
                    Hook catalog
                  </Link>
                  <Link
                    href="/docs/cli"
                    className="rounded-2xl border border-border/60 bg-muted/35 p-3 text-sm transition-colors hover:bg-muted/60"
                  >
                    CLI reference
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-grid border-b border-border/60">
        <div className="container py-12 sm:py-14">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-muted-foreground">
              Why teams use it
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-4xl">
              Practical hooks for the browser, state, async flows, and interface
              details that show up in real applications.
            </h2>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {platformPillars.map((pillar) => {
              const Icon = pillar.icon

              return (
                <div
                  key={pillar.title}
                  className="rounded-[1.75rem] border border-border/60 bg-background/80 p-5 shadow-sm sm:p-6"
                >
                  <div className="flex size-11 items-center justify-center rounded-2xl border border-border/60 bg-muted/40">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {pillar.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-grid border-b border-border/60">
        <div className="container py-12 sm:py-14 lg:py-16">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-muted-foreground">
                Featured hooks
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-4xl">
                Start with hooks that show the range of the registry.
              </h2>
            </div>
            <Link
              href="/docs/hooks"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              View the full catalog <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featuredHooks.map((hook) => (
              <Link
                key={hook.href}
                href={hook.href}
                className="group rounded-[1.75rem] border border-border/60 bg-background/80 p-5 transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-foreground/5 sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                      {hook.category}
                    </p>
                    <h3 className="mt-3 text-xl font-semibold tracking-tight">
                      {hook.title}
                    </h3>
                  </div>
                  <div className="rounded-full border border-border/60 p-2 text-muted-foreground transition-colors group-hover:text-foreground">
                    <ArrowUpRight className="size-4" />
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {hook.description}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-border/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                    {hook.href.replace("/docs/hooks/", "")}
                  </span>
                  {hook.label ? (
                    <span className="rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
                      {hook.label}
                    </span>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-grid">
        <div className="container py-12 sm:py-14 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-muted-foreground">
                Workflow
              </p>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl">
                Keep the good parts of a library without inheriting its weight.
              </h2>
              <p className="max-w-xl text-base leading-7 text-muted-foreground">
                The strongest part of useKit is not just the number of hooks. It
                is the delivery model: discover the pattern, pull it into your
                codebase, and keep control of the final abstraction.
              </p>
            </div>

            <div className="grid gap-4">
              {workflow.map((step, index) => {
                const Icon = step.icon

                return (
                  <div
                    key={step.title}
                    className="rounded-[1.75rem] border border-border/60 bg-background/80 p-5 shadow-sm sm:p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex size-12 items-center justify-center rounded-2xl border border-border/60 bg-muted/40">
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                          Step {index + 1}
                        </p>
                        <h3 className="mt-2 text-xl font-semibold tracking-tight">
                          {step.title}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-10 overflow-hidden rounded-[2rem] border border-border/60 bg-background px-5 py-7 text-foreground shadow-2xl shadow-foreground/10 sm:px-8 sm:py-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-foreground/60">
                  Ready when you are
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-4xl">
                  Start with the catalog, then use the CLI when you want fewer
                  steps between idea and implementation.
                </h2>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/docs"
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "lg" }),
                    "w-full rounded-full sm:w-auto"
                  )}
                >
                  Read the docs
                </Link>
                <Link
                  href="/docs/cli"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "lg" }),
                    "w-full rounded-full border border-primary-foreground/20 sm:w-auto"
                  )}
                >
                  CLI commands
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
