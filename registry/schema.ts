import { z } from "zod";

const registryItemTypeSchema = z.enum(["registry:hook", "registry:example"]);

const registryItemFileSchema = z.object({
  path: z.string(),
  content: z.string().optional(),
  type: registryItemTypeSchema,
  target: z.string().optional(),
});

const registryItemSchema = z.object({
  name: z.string(),
  type: registryItemTypeSchema,
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(registryItemFileSchema).optional(),
});

const registrySchema = z.array(registryItemSchema);

export type RegistryItem = z.infer<typeof registryItemSchema>;

export type Registry = z.infer<typeof registrySchema>;

export default registrySchema;
