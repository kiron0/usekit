import { hooksExamples } from "./examples"
import { hooks } from "./hooks"
import { type Registry } from "./schema"

export const registryItems: Registry["items"] = [...hooks, ...hooksExamples]

export default registryItems
