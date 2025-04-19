"use client"

import Link from "next/link"

import { createFormSchema, FormSchema } from "@/lib/schema"
import { FeedbackForm } from "@/components/feedback-form"
import { notifyError, notifySuccess } from "@/components/toast"

const formSchema = createFormSchema()

export function Feature() {
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
        defaultValues={{
          title: "",
          description: "",
        }}
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
