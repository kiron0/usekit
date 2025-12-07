"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Send } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { useFormDisable } from "registry/hooks/use-form-disable"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email({ message: "Please enter a valid email address" }),
  message: z.string().min(1, "Message is required"),
})
type FormValues = z.infer<typeof formSchema>

export default function UseFormDisableDemo() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  const { disabled } = useFormDisable({
    formState: form.formState,
  })

  const onSubmit = async (data: FormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log("Form submitted:", data)
    form.reset()
  }

  return (
    <div className="w-full space-y-6">
      <Card className="w-full border-none bg-transparent p-0">
        <CardHeader className="p-0">
          <CardTitle>Form Disable While Submitting</CardTitle>
          <CardDescription>
            All form controls are automatically disabled during submission.
            Works seamlessly with react-hook-form and zod validation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <fieldset disabled={disabled} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your message"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">
                  {disabled ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit
                    </>
                  )}
                </Button>
              </fieldset>
            </form>
          </Form>
          <div className="rounded-xl border border-dashed border-muted-foreground/40 p-4">
            <h4 className="mb-2 text-sm font-semibold">How it works</h4>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>
                Automatically detects when the form is submitting via
                react-hook-form&apos;s formState
              </li>
              <li>
                Use a fieldset with disabled attribute to disable all form
                controls at once
              </li>
              <li>
                Works with zod validation - form validates before disabling
              </li>
              <li>
                Form controls are automatically re-enabled after submission
                completes
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
