"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { Textarea } from "@/components/ui/textarea"
import { Loading } from "@/components/loading"
import { notifyError, notifySuccess } from "@/components/toast"

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
})
type FormSchema = z.infer<typeof formSchema>

function FeatureSuspense() {
  const searchParams = useSearchParams()
  const hookName = searchParams.get("name")

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  }) as UseFormReturn<FormSchema>

  const onSubmit = (values: FormSchema) => {
    const payload = {
      ...values,
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

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
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

export function Feature() {
  return (
    <React.Suspense fallback={<Loading />}>
      <FeatureSuspense />
    </React.Suspense>
  )
}
