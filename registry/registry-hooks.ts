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
  {
    name: "use-page-leave",
    title: "Use Page Leave",
    description:
      "Track when a user navigates away from a webpage with usePageLeave.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-page-leave.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-is-first-render",
    title: "Use Is First Render",
    description:
      "Differentiate between the first and subsequent renders with useIsFirstRender.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-is-first-render.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-window-scroll",
    title: "Use Window Scroll",
    description:
      "Track and manipulate the scroll position of a web page with useWindowScroll.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-window-scroll.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-idle",
    title: "Use Idle",
    description: "Detect user inactivity with useIdle.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-idle.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-long-press",
    title: "Use Long Press",
    description:
      "Enable precise control of long-press interactions for both touch and mouse events with useLongPress.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-long-press.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-default",
    title: "Use Default",
    description: "Manage state with default values using useDefault.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-default.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-click-away",
    title: "Use Click Away",
    description:
      "Detect clicks outside of specific component with useClickAway.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-click-away.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-object-state",
    title: "Use Object State",
    description: "Manage complex state objects with useObjectState.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-object-state.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-logger",
    title: "Use Logger",
    description: "Debug lifecycle events with useLogger.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-logger.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-speakup",
    title: "Use Speakup",
    description:
      "Use the useSpeakup hook to convert text to speech, with options to control pitch, rate, volume, and voice selection.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-speakup.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-any-measure",
    title: "Use Any Measure",
    description:
      "Measure the dimensions of any element with useAnyMeasure, providing options to track changes and observe the element.",
    type: "registry:hook",
    dependencies: ["lucide-react"],
    files: [
      {
        path: "hooks/use-any-measure.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-measure",
    title: "Use Measure",
    description:
      "Measure the dimensions of an element with useMeasure, providing options to track changes and observe the element.",
    type: "registry:hook",
    dependencies: ["lucide-react"],
    files: [
      {
        path: "hooks/use-measure.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-is-mobile",
    title: "Use Is Mobile",
    description:
      "Determine if the current device is a mobile device with the useIsMobile hook.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-is-mobile.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-lock-body-scroll",
    title: "Use Lock Body Scroll",
    description:
      "Disable body scrolling with the useLockBodyScroll hook. Useful for modals and other components that require a fixed body.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-lock-body-scroll.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-mounted",
    title: "Use Mounted",
    description:
      "Determine if a component is mounted with the useMounted hook.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-mounted.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-mutation-observer",
    title: "Use Mutation Observer",
    description:
      "Observe mutations on a DOM element with the useMutationObserver hook.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-mutation-observer.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-previous",
    title: "Use Previous",
    description: "Track the previous value of a variable with usePrevious.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-previous.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-history-state",
    title: "Use History State",
    description: "Add undo / redo functionality with useHistoryState.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-history-state.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-async-status",
    title: "Use Async Status",
    description:
      "Track the status of asynchronous operations with useAsyncStatus.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-async-status.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-favicon",
    title: "Use Favicon",
    description: "Dynamically update the favicon of a webpage with useFavicon.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-favicon.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-list",
    title: "Use List",
    description: "Manage and manipulate lists with useList.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-list.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-map",
    title: "Use Map",
    description:
      "Synchronize and update state based on the Map data structure with useMap.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-map.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-queue",
    title: "Use Queue",
    description:
      "Add, remove, and clear element from a queue data structure with useQueue.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-queue.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-set",
    title: "Use Set",
    description:
      "Synchronize and update state based on the Set data structure with useSet.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-set.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-throttle",
    title: "Use Throttle",
    description:
      "Throttle computationally expensive operations with useThrottle.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-throttle.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-continuous-retry",
    title: "Use Continuous Retry",
    description:
      "Automates retries of a callback function until it succeeds with useContinuousRetry.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-continuous-retry.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-event-listener",
    title: "Use Event Listener",
    description: "Listen for events on a target element with useEventListener.",
    type: "registry:hook",
    registryDependencies: [
      "https://usekit.kiron.dev/r/use-isomorphic-layout-effect",
    ],
    files: [
      {
        path: "hooks/use-event-listener.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-random-interval",
    title: "Use Random Interval",
    description:
      "Execute a callback function at a random interval with useRandomInterval.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-random-interval.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-dropzone",
    title: "Use Dropzone",
    description:
      "Drag and drop files into a dropzone with useDropzone, providing options to customize the dropzone.",
    type: "registry:hook",
    registryDependencies: ["https://usekit.kiron.dev/r/use-event-listener"],
    files: [
      {
        path: "hooks/use-dropzone.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-input-value",
    title: "Use Input Value",
    description: "A hook to manage input values with useInputValue.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-input-value.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-step",
    title: "Use Step",
    description: "A hook to manage step values with useStep.",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-step.tsx",
        type: "registry:hook",
      },
    ],
  },
]

export default hooks
