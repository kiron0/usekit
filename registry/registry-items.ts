import { hooks } from "./registry-hooks"
import { hooksExamples } from "./registry-hooks-examples"
import { type Registry } from "./schema"

export const registryItems: Registry["items"] = [...hooks, ...hooksExamples]
