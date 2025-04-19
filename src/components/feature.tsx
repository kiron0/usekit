"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"

import { createFormSchema, FormSchema } from "@/lib/schema"
import { FeedbackForm } from "@/components/feedback-form"
import { Loading } from "@/components/loading"
import { notifyError, notifySuccess } from "@/components/toast"

const formSchema = createFormSchema()

export function Feature() {
  const searchParams = useSearchParams()
  const hookName = searchParams.get("h")

  const onSubmit = (values: FormSchema) => {
    const payload = {
      ...values,
    }

    try {
      console.log(payload)
      notifySuccess({
        description: "Feature request created successfully",
      })
    } catch (error) {
      notifyError({
        description: "Error creating feature request",
      })
    }
  }

  return (
    <React.Suspense fallback={<Loading />}>
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
        cancelHref={hookName ? `/docs/hooks/${hookName}` : "/docs"}
        submitText="Create"
      />
    </React.Suspense>
  )
}
