"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { allDocs } from "contentlayer/generated"
import { useForm, UseFormReturn } from "react-hook-form"
import { z } from "zod"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SelectSearch } from "@/components/ui/select-search"
import { Textarea } from "@/components/ui/textarea"
import { Loading } from "@/components/loading"
import { notifyError, notifySuccess } from "@/components/toast"

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  hook: z.string().optional(),
  description: z.string().min(1, { message: "Description is required" }),
})
type FormSchema = z.infer<typeof formSchema>

function ReportSuspense() {
  const [isValidHook, setIsValidHook] = React.useState(false)
  const searchParams = useSearchParams()
  const hookName = searchParams.get("name")

  const allHooks = React.useMemo(() => {
    return allDocs
      .filter((doc) => doc.title.startsWith("use"))
      .sort((a, b) => a.title.localeCompare(b.title))
      .map((doc) => {
        return {
          label: doc.slug.replace("/docs/hooks/", "").replace(/-/g, " "),
          value: doc.slug.replace("/docs/hooks/", ""),
        }
      })
  }, [])

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      hook: hookName || undefined,
      description: "",
    },
  }) as UseFormReturn<FormSchema>

  const onSubmit = (values: FormSchema) => {
    const { hook } = values

    if (hookName && !isValidHook) {
      return notifyError({
        description: "Invalid hook name. Please go back and click again.",
      })
    }

    if (!hookName && !hook) {
      return notifyError({
        description: "Please select the hook you want to report.",
      })
    }

    const payload = {
      ...values,
      hook: hookName || hook,
    }

    try {
      console.log(payload)
      notifySuccess({
        description: "Report created successfully",
      })
    } catch (error) {
      notifyError({
        description: "Error creating report",
      })
    }
  }

  React.useEffect(() => {
    if (hookName) {
      const isValid = allHooks.some((hook) => hook.value.includes(hookName))
      setIsValidHook(isValid)
    }
  }, [hookName, allHooks])

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            {!hookName && (
              <FormField
                control={form.control}
                name="hook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hook</FormLabel>
                    <FormControl>
                      <SelectSearch
                        value={field.value}
                        onChange={(values) => field.onChange(values as string)}
                        options={allHooks}
                        selectText="Select a hook"
                        searchText="Search for a hook..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description"
                      className="min-h-52"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <Link
              href={hookName ? `/docs/hooks/${hookName}` : "/docs"}
              className={buttonVariants({
                variant: "outline",
              })}
            >
              Cancel
            </Link>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export function Report() {
  return (
    <React.Suspense fallback={<Loading />}>
      <ReportSuspense />
    </React.Suspense>
  )
}
