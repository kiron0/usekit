import { z } from "zod"

interface FormSchemaOptions {
  includeHook?: boolean
}

export const createFormSchema = ({
  includeHook = false,
}: FormSchemaOptions = {}) => {
  const baseSchema = {
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
  }

  const hookSchema = {
    hook: includeHook
      ? z
          .string({
            required_error: "Hook is required",
          })
          .min(1, {
            message: "Hook is required",
          })
      : z.undefined(),
  }

  return z.object({ ...baseSchema, ...hookSchema })
}

export type FormSchema = z.infer<ReturnType<typeof createFormSchema>>
