"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { createFormSchema, FormSchema } from "@/lib/schema"
import { FeedbackForm } from "@/components/feedback-form"
import { notifyError, notifySuccess } from "@/components/toast"

const formSchema = createFormSchema()

export function Feature() {
  const searchParams = useSearchParams()
  const hookName = searchParams.get("h")

  const DEFAULT_VALUES = {
    title: `[feat]: /docs/hooks/${hookName}`,
    description:
      "<p><strong>Is your feature request related to a problem? Please describe.</strong><br>A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]</p><p></p><p><strong>Describe the solution you'd like</strong><br>A clear and concise description of what you want to happen.</p><p></p><p><strong>Describe alternatives you've considered</strong><br>A clear and concise description of any alternative solutions or features you've considered.</p><p></p><p><strong>Additional context</strong><br>Add any other context or screenshots about the feature request here.</p>",
  }

  const onSubmit = (values: FormSchema) => {
    const payload = {
      ...values,
    }

    try {
      notifySuccess({
        description: "Feature request has been sent successfully",
      })
    } catch (error) {
      notifyError({
        description: "Error creating feature request",
      })
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
        cancelHref="/docs"
        submitText="Create"
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
