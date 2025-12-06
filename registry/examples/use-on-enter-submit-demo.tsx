"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2, Keyboard, Send, XCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Badge } from "@/components/ui/badge"
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
import { useOnEnterSubmit } from "registry/hooks/use-on-enter-submit"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email({ message: "Please enter a valid email address" }),
  message: z.string().min(1, "Message is required"),
})

type FormValues = z.infer<typeof formSchema>

export default function UseOnEnterSubmitDemo() {
  const [submitCount, setSubmitCount] = React.useState(0)
  const [lastSubmitTime, setLastSubmitTime] = React.useState<Date | null>(null)
  const [submittedViaEnter, setSubmittedViaEnter] = React.useState(false)
  const formRef = React.useRef<HTMLFormElement>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  const handleSubmit = async (data: FormValues) => {
    setSubmitCount((prev) => prev + 1)
    setLastSubmitTime(new Date())
    setSubmittedViaEnter(false)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Form submitted:", data)
      form.reset()
    } catch (error) {
      console.error("Submission error:", error)
    }
  }

  const handleEnterSubmit = () => {
    setSubmittedViaEnter(true)
    form.handleSubmit(handleSubmit)()
  }

  useOnEnterSubmit(formRef, handleEnterSubmit)

  return (
    <div className="w-full space-y-6">
      <Card className="w-full border-none bg-transparent p-0">
        <CardHeader className="flex flex-col justify-between gap-3 p-0 lg:flex-row">
          <div>
            <CardTitle>On Enter Submit</CardTitle>
            <CardDescription>
              Press Enter in any input field to submit the form — but only if
              all fields are valid. Try submitting with invalid data to see
              validation errors.
            </CardDescription>
          </div>
          <div>
            <Badge variant="secondary">
              <Keyboard className="mr-1 h-3 w-3" />
              Enter to submit
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-0">
          <Form {...form}>
            <form
              ref={formRef}
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your name"
                        {...field}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                          }
                        }}
                      />
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
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                          }
                        }}
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
                        placeholder="Enter your message (Shift+Enter for new line)"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-2">
                <Button type="submit">
                  <Send className="h-4 w-4" />
                  Submit
                </Button>
                {submittedViaEnter && (
                  <Badge variant="outline" className="ml-2">
                    Submitted via Enter key
                  </Badge>
                )}
              </div>
            </form>
          </Form>

          <div className="rounded-xl border border-dashed border-muted-foreground/40 p-4">
            <h4 className="mb-4 text-sm font-semibold">Submission Stats</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-3">
                <div className="text-xs text-muted-foreground">
                  Total Submissions
                </div>
                <div className="text-2xl font-bold">{submitCount}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-xs text-muted-foreground">Status</div>
                <div className="flex items-center gap-2">
                  {submitCount > 0 ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span className="text-lg font-semibold">Submitted</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-muted-foreground" />
                      <span className="text-lg font-semibold">Ready</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            {lastSubmitTime && (
              <div className="mt-4 text-sm text-muted-foreground">
                Last submitted: {lastSubmitTime.toLocaleTimeString()}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-dashed border-muted-foreground/40 p-4">
            <h4 className="mb-2 text-sm font-semibold">How it works</h4>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>
                Press Enter in any input field to submit the form automatically
              </li>
              <li>
                The form only submits if all fields pass validation — invalid
                fields will show errors
              </li>
              <li>
                Textarea fields are excluded — use Shift+Enter for new lines
              </li>
              <li>
                Works with any form validation library or native HTML5
                validation
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
