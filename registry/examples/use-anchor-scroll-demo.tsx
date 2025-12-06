"use client"

import { ArrowDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAnchorScroll } from "registry/hooks/use-anchor-scroll"

export default function UseAnchorScrollDemo() {
  const { scrollToId } = useAnchorScroll()

  return (
    <div className="w-full space-y-6">
      <Card className="w-full border-none bg-transparent p-0">
        <CardHeader className="flex flex-col justify-between gap-3 p-0 lg:flex-row">
          <div>
            <CardTitle>Anchor Scroll</CardTitle>
            <CardDescription>
              Scroll smoothly to any anchor ID without changing the URL. Click
              the buttons below to navigate to different sections.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-0">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => scrollToId("section-1")}>
                Scroll to Section 1
              </Button>
              <Button onClick={() => scrollToId("section-2")}>
                Scroll to Section 2
              </Button>
              <Button onClick={() => scrollToId("section-3")}>
                Scroll to Section 3
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Notice how the URL doesn&apos;t change when you scroll to a
              section.
            </p>
          </div>

          <div className="space-y-8">
            <div
              id="section-1"
              className="rounded-xl border bg-card p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center gap-2">
                <h3 className="text-lg font-semibold">Section 1</h3>
                <ArrowDown className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                This is the first section. Click the button above to scroll here
                smoothly without changing the URL.
              </p>
              <div className="mt-4 h-32 rounded-lg bg-muted/50" />
            </div>

            <div
              id="section-2"
              className="rounded-xl border bg-card p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center gap-2">
                <h3 className="text-lg font-semibold">Section 2</h3>
                <ArrowDown className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                This is the second section. The scroll animation is smooth and
                the URL remains unchanged.
              </p>
              <div className="mt-4 h-32 rounded-lg bg-muted/50" />
            </div>

            <div
              id="section-3"
              className="rounded-xl border bg-card p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center gap-2">
                <h3 className="text-lg font-semibold">Section 3</h3>
                <ArrowDown className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                This is the third section. Perfect for navigation menus where
                you want smooth scrolling without URL hash changes.
              </p>
              <div className="mt-4 h-32 rounded-lg bg-muted/50" />
            </div>
          </div>

          <div className="rounded-xl border border-dashed border-muted-foreground/40 p-4">
            <h4 className="mb-2 text-sm font-semibold">How it works</h4>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>
                Call{" "}
                <code className="rounded bg-muted px-1">scrollToId(id)</code>{" "}
                with the element ID you want to scroll to
              </li>
              <li>
                The hook uses{" "}
                <code className="rounded bg-muted px-1">scrollIntoView</code>{" "}
                with smooth behavior
              </li>
              <li>
                The URL remains unchanged, unlike traditional anchor links
              </li>
              <li>
                Works with any element that has an{" "}
                <code className="rounded bg-muted px-1">id</code> attribute
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
