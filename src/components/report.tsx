"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "nextjs-toploader/app"
import { ControllerRenderProps } from "react-hook-form"

import { createReport } from "@/lib/action"
import { createFormSchema, FormSchema } from "@/lib/schema"
import { SelectSearch } from "@/components/ui/select-search"
import { FeedbackForm, FieldDefinition } from "@/components/feedback-form"
import { Loading } from "@/components/loading"
import { notifyError, notifySuccess } from "@/components/toast"
import { allDocs } from "@/contentlayer/generated"

const formSchema = createFormSchema({ includeHook: true })

export function Report() {
  const searchParams = useSearchParams()
  const hookName = searchParams.get("h")

  const router = useRouter()

  const [isLoading, setIsLoading] = React.useState(false)

  const DEFAULT_VALUES = {
    title: `[bug]: /docs/hooks/${hookName || "[hookName]"}`,
    hook: hookName || "",
    description: `<p>Summary:</p><p>          [Briefly describe the bug you encountered]</p><p></p><p>Documentation:</p><p>          [Link to the documentation page where you encountered the bug]</p><p></p><p>Code:</p><p>          [Link to the code where you encountered the bug]</p><p></p><p>Steps:</p><p>          [Steps to reproduce the bug]</p><p></p><p>Expected:</p><p>          [What did you expect to happen?]</p><p></p><p>Actual:</p><p>          [What actually happened?]</p>`,
  }

  const allHooks = React.useMemo(() => {
    return allDocs
      .filter((doc) => doc.title.startsWith("use"))
      .sort((a, b) => a.title.localeCompare(b.title))
      .map((doc) => {
        return {
          label: doc.title,
          value: doc.slug.replace("/docs/hooks/", ""),
        }
      })
  }, [])

  const onSubmit = async (values: FormSchema) => {
    const { hook } = values

    if (hookName && !allHooks.some((h) => h.value === hookName)) {
      return notifyError({
        description: "Invalid hook name. Please go back and click again.",
      })
    }

    const payload = {
      ...values,
      hook: hookName || hook,
      type: "report" as const,
    }

    try {
      setIsLoading(true)
      const result = await createReport(payload)

      if (result.success) {
        notifySuccess({
          description:
            "Your report has been submitted successfully. Thank you!",
        })
        router.push("/docs")
      }
    } catch (error) {
      notifyError({
        description: "Error creating report",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <React.Suspense fallback={<Loading />}>
      <FeedbackForm
        schema={formSchema}
        defaultValues={DEFAULT_VALUES}
        fields={
          [
            !hookName
              ? {
                  name: "hook",
                  label: "Hook",
                  type: "custom",
                  render: (
                    field: ControllerRenderProps<FormSchema, "hook">
                  ) => (
                    <SelectSearch
                      value={field.value}
                      onChange={(values) => field.onChange(values as string)}
                      options={allHooks}
                      selectText="Select a hook"
                      searchText="Search for a hook..."
                    />
                  ),
                }
              : undefined,
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
          ].filter(Boolean) as FieldDefinition<FormSchema>[]
        }
        onSubmit={onSubmit}
        cancelHref={hookName ? `/docs/hooks/${hookName}` : "/docs"}
        submitText={isLoading ? "Creating..." : "Create Report"}
        loading={isLoading}
      />
    </React.Suspense>
  )
}
