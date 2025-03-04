import { exec } from "child_process"
import { promises as fs } from "fs"
import path from "path"
import { rimraf } from "rimraf"

import { type Registry } from "../registry/schema"

const hooks: Registry["items"] = [
  {
    name: "use-boolean",
    title: "Use Boolean",
    description:
      "Manage a boolean state with the useBoolean hook, providing methods to set it to true, false, or toggle between them",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-boolean.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-toggle",
    title: "Use Toggle",
    description: "Easily manage a boolean state with useToggle.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-toggle.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-copy-to-clipboard",
    title: "Use Copy To Clipboard",
    description:
      "Use the useCopyToClipboard hook to copy text to the clipboard and track whether the copy action was successful, with an optional delay to reset the copied state.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-copy-to-clipboard.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-unmount",
    title: "Use Unmount",
    description:
      "Run a function when a component unmounts, ensuring cleanups or final actions are handled effectively.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-unmount.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-debounce-callback",
    title: "Use Debounce Callback",
    description:
      "Delay function execution with useDebounceCallback, providing options for canceling, flushing, and checking if a call is pending.",
    type: "registry:hook",
    registryDependencies: ["https://usekit.kiron.dev/r/use-unmount"],
    dependencies: ["lodash.debounce"],
    devDependencies: ["@types/lodash.debounce"],
    files: [
      {
        path: "hooks/use-debounce-callback.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-isomorphic-layout-effect",
    title: "Use Isomorphic Layout Effect",
    description:
      "Custom hook that uses either useLayoutEffect or useEffect based on the environment (client-side or server-side).",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-isomorphic-layout-effect.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-interval",
    title: "Use Interval",
    description:
      "Execute a callback function at specified intervals with useInterval, supporting dynamic delays and cleanup on unmount.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-interval.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-timeout",
    title: "Use Timeout",
    description:
      "Run a callback function after a specified delay with useTimeout.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-timeout.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-document-title",
    title: "Use Document Title",
    description:
      "Dynamically update the document title. Pass a string, and the document title updates whenever the value changes.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-document-title.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-counter",
    title: "Use Counter",
    description:
      "Manage a numeric state with useCounter, offering functions to increment, decrement, reset, and set a custom value.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-counter.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-mouse-position",
    title: "Use Mouse Position",
    description:
      "Use the useCopyToClipboard hook to copy text to the clipboard and track whether the copy action was successful, with an optional delay to reset the copied state.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-mouse-position.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-battery",
    title: "Use Battery",
    description: "Track the battery status of a user's device with useBattery.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-battery.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-local-storage",
    title: "Use Local Storage",
    description:
      "Store, retrieve, and synchronize data from the browser's localStorage API with useLocalStorage.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-local-storage.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-session-storage",
    title: "Use Session Storage",
    description:
      "Store, retrieve, and synchronize data from the browser's sessionStorage API with useSessionStorage.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-session-storage.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-fetch",
    title: "Use Battery",
    description:
      "Fetch data with accurate states, caching, and no stale responses using useFetch.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-fetch.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-script",
    title: "Use Script",
    description: "Load and manage external JavaScript scripts with useScript.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-script.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-scramble",
    title: "Use Scramble",
    description:
      "Scramble text with the useScramble hook, providing methods to scramble, unscramble, and toggle between them.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-scramble.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-intersection-observer",
    title: "Use Intersection Observer",
    description:
      "A hook that provides a way to detect when an element enters or leaves the viewport using the Intersection Observer API.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-intersection-observer.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-render-count",
    title: "Use Render Count",
    description:
      "Identify unnecessary re-renders and monitor update frequency with useRenderCount.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-render-count.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-orientation",
    title: "Use Orientation",
    description:
      "Manage and respond to changes in device orientation with useOrientation.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-orientation.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-window-size",
    title: "Use Window Size",
    description:
      "Track the dimensions of the browser window with useWindowSize.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-window-size.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-hover",
    title: "Use Hover",
    description:
      "Track whether an element is being hovered over with useHover.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-hover.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-media-query",
    title: "Use Media Query",
    description:
      "Subscribe and respond to media query changes with useMediaQuery.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-media-query.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-interval-when",
    title: "Use Interval When",
    description:
      "Create dynamic timers that can be started, paused, or resumed with useIntervalWhen.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-interval-when.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-countdown",
    title: "Use Countdown",
    description: "Create countdown timers using useCountdown.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-countdown.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-visibility-change",
    title: "Use Visibility Change",
    description:
      "Track document visibility and respond to changes with useVisibilityChange.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-visibility-change.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-key-press",
    title: "Use Key Press",
    description:
      "Detect and perform actions on key press events with useKeyPress.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-key-press.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-cookie-storage",
    title: "Use Cookie Storage",
    description:
      "Store, retrieve, and synchronize data from the browser's Cookie Store API with useCookieStorage.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-cookie-storage.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-is-client",
    title: "Use Is Client",
    description:
      "Determine whether the code is running on the client-side or server-side with useIsClient.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-is-client.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-geolocation",
    title: "Use Geolocation",
    description:
      "Access and monitor a user's geolocation (after they give permission) with useGeolocation.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-geolocation.tsx",
        type: "registry:hook",
      },
    ],
  },
]

const hooksExamples: Registry["items"] = [
  {
    name: "use-copy-to-clipboard-demo",
    type: "registry:example",
    files: [
      {
        path: "examples/use-copy-to-clipboard-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "use-interval-demo",
    type: "registry:example",
    files: [
      {
        path: "examples/use-interval-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "use-timeout-demo",
    type: "registry:example",
    files: [
      {
        path: "examples/use-timeout-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "use-document-title-demo",
    type: "registry:example",
    files: [
      {
        path: "examples/use-document-title-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "use-mouse-position-demo",
    type: "registry:example",
    files: [
      {
        path: "examples/use-mouse-position-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "use-counter-demo",
    type: "registry:example",
    files: [
      {
        path: "examples/use-counter-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "use-scramble-demo",
    type: "registry:example",
    files: [
      {
        path: "examples/use-scramble-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "use-fetch-demo",
    type: "registry:example",
    files: [
      {
        path: "examples/use-fetch-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "use-local-storage-demo",
    type: "registry:example",
    files: [
      {
        path: "examples/use-local-storage-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "use-session-storage-demo",
    type: "registry:example",
    files: [
      {
        path: "examples/use-session-storage-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "use-script-demo",
    type: "registry:example",
    files: [
      {
        path: "examples/use-script-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "use-render-count-demo",
    type: "registry:example",
    files: [
      {
        path: "examples/use-render-count-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "use-orientation-demo",
    type: "registry:example",
    files: [
      {
        path: "examples/use-orientation-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "use-window-size-demo",
    type: "registry:example",
    files: [
      {
        path: "examples/use-window-size-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "use-hover-demo",
    type: "registry:example",
    files: [
      {
        path: "examples/use-hover-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "use-battery-demo",
    type: "registry:example",
    files: [
      {
        path: "examples/use-battery-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "use-media-query-demo",
    type: "registry:example",
    files: [
      {
        path: "examples/use-media-query-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "use-interval-when-demo",
    type: "registry:example",
    files: [
      {
        path: "examples/use-interval-when-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "use-countdown-demo",
    type: "registry:example",
    files: [
      {
        path: "examples/use-countdown-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "use-visibility-change-demo",
    type: "registry:example",
    files: [
      {
        path: "examples/use-visibility-change-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "use-key-press-demo",
    type: "registry:example",
    files: [
      {
        path: "examples/use-key-press-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "use-cookie-storage-demo",
    type: "registry:example",
    files: [
      {
        path: "examples/use-cookie-storage-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "use-is-client-demo",
    type: "registry:example",
    files: [
      {
        path: "examples/use-is-client-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "use-geolocation-demo",
    type: "registry:example",
    files: [
      {
        path: "examples/use-geolocation-demo.tsx",
        type: "registry:example",
      },
    ],
  },
]

const registryItems = [...hooks, ...hooksExamples]

const registry: Registry = {
  name: "useKit",
  homepage: "https://usekit.kiron.dev",
  items: registryItems,
} satisfies Registry

async function buildRegistryIndex() {
  let index = `/* eslint-disable */
//
// @ts-nocheck
// This file is autogenerated by scripts/build-registry.ts
// Do not edit this file directly.
import * as React from "react"

export const Index: Record<string, any> = {`

  for (const item of registry.items) {
    const resolveFiles = item.files?.map(
      (file) => `registry/${typeof file === "string" ? file : file.path}`
    )
    if (!resolveFiles) {
      continue
    }

    const fileExtension = resolveFiles[0].split(".").pop()
    const sourceFilename = ""

    let hookPath = ""

    if (item.files) {
      const files = item.files.map((file) =>
        typeof file === "string" ? { type: "registry:page", path: file } : file
      )
      if (files?.length) {
        hookPath = `registry/${item.type === "registry:example" ? "examples" : "hooks"}/${item.name}${item.type === "registry:example" ? "" : `.${fileExtension}`}`
      }
      if (item.type !== "registry:example" && !item.name.includes("-demo")) {
        const demoExists = registry.items.some(
          (i) => i.name === `${item.name}-demo`
        )
        if (demoExists) {
          hookPath = `registry/examples/${item.name}-demo`
        }
      }
    }

    index += `
  "${item.name}": {
    name: "${item.name}",
    type: "${item.type}",
    registryDependencies: ${JSON.stringify(item.registryDependencies)},
    files: [${item.files?.map((file) => {
      const filePath = `registry/${typeof file === "string" ? file : file.path}`
      const resolvedFilePath = path.resolve(filePath)
      return typeof file === "string"
        ? `"${resolvedFilePath}"`
        : `{
      path: "${`registry/${item.type === "registry:example" ? "examples" : "hooks"}/${item.name}.${fileExtension}`}",
      type: "${file.type}",
      target: "${file.target ?? ""}"
    }`
    })}],
    component: React.lazy(() => import("${hookPath}")),
    source: "${sourceFilename}",
  },`
  }

  index += `
}
`

  rimraf.sync(path.join(process.cwd(), "__registry__/index.tsx"))
  await fs.writeFile(path.join(process.cwd(), "__registry__/index.tsx"), index)
}

async function buildRegistryJsonFile() {
  const fixedRegistry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    ...registry,
    items: hooks.map((item) => {
      const files = item.files?.map((file) => {
        return {
          type: file.type,
          path: `registry/hooks/${item.name}.${
            typeof file === "string" ? file : file.path.split(".").pop()
          }`,
        }
      })

      return {
        ...item,
        files,
      }
    }),
  }

  const jsonFilePath = path.join(process.cwd(), `public/r/index.json`)
  await fs.mkdir(path.dirname(jsonFilePath), { recursive: true })
  rimraf.sync(jsonFilePath)
  await fs.writeFile(jsonFilePath, JSON.stringify(fixedRegistry, null, 2))
}

async function buildRegistry() {
  return new Promise((resolve, reject) => {
    const process = exec(
      `bunx --bun shadcn@latest build public/r/index.json --output public/r/hooks`
    )

    process.on("exit", (code) => {
      if (code === 0) {
        resolve(undefined)
      } else {
        reject(new Error(`Process exited with code ${code}`))
      }
    })
  })
}

try {
  console.log("🗂️ Building __registry__/index.tsx...")
  await buildRegistryIndex()

  console.log("💅 Building registry.json...")
  await buildRegistryJsonFile()

  console.log("🚀 Building registry...")
  await buildRegistry()
} catch (error) {
  console.error(error)
  process.exit(1)
}
