"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useRouter } from "nextjs-toploader/app"

import { createReport } from "@/lib/action"
import { createFormSchema, FormSchema } from "@/lib/schema"
import { FeedbackForm } from "@/components/feedback-form"
import { notifyError, notifySuccess } from "@/components/toast"

const formSchema = createFormSchema()

export function Feature() {
  const searchParams = useSearchParams()
  const hookName = searchParams.get("h")

  const router = useRouter()

  const [isLoading, setIsLoading] = React.useState(false)

  const DEFAULT_VALUES = {
    title: `[feat]: /docs/hooks/${hookName || "[hookName]"}`,
    description:
      "<p><strong>Is your feature request related to a problem? Please describe.</strong><br>A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]</p><p></p><p><strong>Describe the solution you'd like</strong><br>A clear and concise description of what you want to happen.</p><p></p><p><strong>Describe alternatives you've considered</strong><br>A clear and concise description of any alternative solutions or features you've considered.</p><p></p><p><strong>Additional context</strong><br>Add any other context or screenshots about the feature request here.</p>",
  }

  const onSubmit = async (values: FormSchema) => {
    const payload = {
      ...values,
      ...(hookName ? { hook: hookName } : {}),
      type: "feature" as const,
    }

    try {
      setIsLoading(true)
      const result = await createReport(payload)

      if (result.success) {
        notifySuccess({
          description:
            "Your feature request has been submitted successfully. Thank you!",
        })
        router.push("/docs")
      }
    } catch (error) {
      console.error("Error creating feature request", error)
      notifyError({
        description: "Error creating feature request",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <FeedbackForm
        schema={formSchema}
        defaultValues={DEFAULT_VALUES}
        fields={[
          {
            name: "title",
            label: "Title",
            type: "input",
          },
          {
            name: "description",
            label: "Description",
            type: "textarea",
          },
        ]}
        onSubmit={onSubmit}
        cancelHref={hookName ? `/docs/hooks/${hookName}` : "/docs"}
        submitText={isLoading ? "Creating..." : "Create Feature"}
        loading={isLoading}
      />
      <p className="text-sm text-muted-foreground">
        If you wish to report an issue, we encourage you to{" "}
        <Link href="/docs/report" className="text-sky-500 underline">
          visit this page
        </Link>
        . Thank you for your feedback!
      </p>
    </div>
  )
}
