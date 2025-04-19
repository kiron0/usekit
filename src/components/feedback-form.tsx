"use client"

import * as React from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ControllerRenderProps,
  DefaultValues,
  FieldValues,
  Path,
  useForm,
  UseFormReturn,
} from "react-hook-form"
import { z, ZodType } from "zod"

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
import { Editor } from "@/components/rich-text/editor"

export interface FieldDefinition<T extends FieldValues> {
  name: Path<T>
  label: string
  type: "input" | "textarea" | "custom"
  render?: (
    field: ControllerRenderProps<T, Path<T>>,
    form: UseFormReturn<T>
  ) => React.ReactNode
}

interface FeedbackFormProps<T extends ZodType<any, any, any>> {
  schema: T
  fields: FieldDefinition<z.infer<T>>[]
  onSubmit: (values: z.infer<T>) => void
  cancelHref: string
  submitText?: string
  loading?: boolean
  defaultValues: DefaultValues<z.infer<T>>
}

export function FeedbackForm<TSchema extends ZodType<any, any, any>>({
  schema,
  fields,
  onSubmit,
  cancelHref,
  submitText = "Create",
  loading = false,
  defaultValues,
}: FeedbackFormProps<TSchema>) {
  const form = useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema),
    defaultValues,
  }) as UseFormReturn<z.infer<TSchema>>

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          {fields.map((fieldDef) => (
            <FormField
              key={String(fieldDef.name)}
              control={form.control}
              name={fieldDef.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{fieldDef.label}</FormLabel>
                  <FormControl>
                    {fieldDef.type === "input" ? (
                      <Input placeholder={fieldDef.label} {...field} />
                    ) : fieldDef.type === "textarea" ? (
                      <Editor
                        content={field.value}
                        onChange={(value) => field.onChange(value)}
                      />
                    ) : fieldDef.render ? (
                      fieldDef.render(field, form)
                    ) : null}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
        <div className="flex items-center justify-end gap-2">
          <Link
            href={cancelHref}
            className={buttonVariants({ variant: "outline" })}
          >
            Cancel
          </Link>
          <Button type="submit" disabled={loading}>
            {submitText}
          </Button>
        </div>
      </form>
    </Form>
  )
}
