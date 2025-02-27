import { examples } from "./registry-examples";
import { hooks } from "./registry-hooks";
import type { Registry } from "./schema";

const registry: Registry = [...hooks, ...examples];

export default registry;
