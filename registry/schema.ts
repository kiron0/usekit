import { z } from "zod"

export const registryItemTypeSchema = z.enum([
  "registry:hook",
  "registry:lib",
  "registry:example",
])

export const registryItemFileSchema = z.object({
  path: z.string(),
  content: z.string().optional(),
  type: registryItemTypeSchema,
  target: z.string().optional(),
})

export const registryItemSchema = z.object({
  title: z.string().optional(),
  name: z.string(),
  description: z.string().optional(),
  type: registryItemTypeSchema,
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(registryItemFileSchema).optional(),
})

export const registrySchema = z.object({
  name: z.string(),
  homepage: z.string(),
  items: z.array(registryItemSchema),
})

export type RegistryItem = z.infer<typeof registryItemSchema>

export type Registry = z.infer<typeof registrySchema>

export default registryItemSchema
