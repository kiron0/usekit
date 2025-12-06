"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2, Lock, Send, Unlock, XCircle } from "lucide-react"
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
import { useSubmitLock } from "registry/hooks/use-submit-lock"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email({ message: "Please enter a valid email address" }),
  message: z.string().min(1, "Message is required"),
})
type FormValues = z.infer<typeof formSchema>

export default function UseSubmitLockDemo() {
  const { locked, lock, unlock } = useSubmitLock()
  const [submitCount, setSubmitCount] = React.useState(0)
  const [lastSubmitTime, setLastSubmitTime] = React.useState<Date | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    if (locked) {
      return
    }

    lock()
    setSubmitCount((prev) => prev + 1)
    setLastSubmitTime(new Date())

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Form submitted:", data)
    } catch (error) {
      console.error("Submission error:", error)
    } finally {
      unlock()
    }
  }

  return (
    <div className="w-full space-y-6">
      <Card className="w-full border-none bg-transparent p-0">
        <CardHeader className="flex flex-col justify-between gap-3 p-0 lg:flex-row">
          <div>
            <CardTitle>Submit Lock</CardTitle>
            <CardDescription>
              Prevent double submissions by locking form submissions. Try
              clicking submit multiple times quickly.
            </CardDescription>
          </div>
          <div>
            <Badge variant={locked ? "destructive" : "secondary"}>
              {locked ? (
                <>
                  <Lock className="mr-1 h-3 w-3" />
                  Locked
                </>
              ) : (
                <>
                  <Unlock className="mr-1 h-3 w-3" />
                  Unlocked
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your name"
                        disabled={locked}
                        {...field}
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
                        disabled={locked}
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
                        disabled={locked}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-2">
                <Button type="submit" disabled={locked}>
                  {locked ? (
                    <>
                      <Lock className="h-4 w-4" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit
                    </>
                  )}
                </Button>
                {locked && (
                  <Button type="button" variant="outline" onClick={unlock}>
                    <Unlock className="h-4 w-4" />
                    Force Unlock
                  </Button>
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
                  {locked ? (
                    <>
                      <XCircle className="h-5 w-5 text-yellow-500" />
                      <span className="text-lg font-semibold">Locked</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
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
                Click the submit button multiple times quickly - only the first
                click will process
              </li>
              <li>
                The form is locked during submission, preventing duplicate
                requests
              </li>
              <li>Form fields and submit button are disabled while locked</li>
              <li>
                The lock is automatically released after submission completes
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
