import { type Registry } from "./schema"

export const hooks: Registry["items"] = [
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
]
