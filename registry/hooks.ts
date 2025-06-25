import { siteConfig } from "@/config/site"

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
        path: "registry/hooks/use-boolean.ts",
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
        path: "registry/hooks/use-toggle.ts",
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
        path: "registry/hooks/use-copy-to-clipboard.ts",
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
        path: "registry/hooks/use-unmount.ts",
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
    registryDependencies: [`${siteConfig.url}/k/use-unmount`],
    dependencies: ["lodash.debounce@4.0.8"],
    devDependencies: ["@types/lodash.debounce@4.0.9"],
    files: [
      {
        path: "registry/hooks/use-debounce-callback.ts",
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
        path: "registry/hooks/use-isomorphic-layout-effect.ts",
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
        path: "registry/hooks/use-interval.ts",
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
        path: "registry/hooks/use-timeout.ts",
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
        path: "registry/hooks/use-document-title.ts",
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
        path: "registry/hooks/use-counter.ts",
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
    registryDependencies: [`${siteConfig.url}/k/use-is-mobile`],
    files: [
      {
        path: "registry/hooks/use-mouse-position.ts",
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
        path: "registry/hooks/use-battery.ts",
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
        path: "registry/hooks/use-local-storage.ts",
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
        path: "registry/hooks/use-session-storage.ts",
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
        path: "registry/hooks/use-fetch.ts",
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
        path: "registry/hooks/use-script.ts",
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
        path: "registry/hooks/use-scramble.ts",
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
        path: "registry/hooks/use-intersection-observer.ts",
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
        path: "registry/hooks/use-render-count.ts",
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
        path: "registry/hooks/use-orientation.ts",
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
        path: "registry/hooks/use-window-size.ts",
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
        path: "registry/hooks/use-hover.ts",
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
        path: "registry/hooks/use-media-query.ts",
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
        path: "registry/hooks/use-interval-when.ts",
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
        path: "registry/hooks/use-countdown.ts",
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
        path: "registry/hooks/use-visibility-change.ts",
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
        path: "registry/hooks/use-key-press.ts",
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
        path: "registry/hooks/use-cookie-storage.ts",
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
        path: "registry/hooks/use-is-client.ts",
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
        path: "registry/hooks/use-geolocation.ts",
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
        path: "registry/hooks/use-page-leave.ts",
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
        path: "registry/hooks/use-is-first-render.ts",
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
        path: "registry/hooks/use-window-scroll.ts",
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
        path: "registry/hooks/use-idle.ts",
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
        path: "registry/hooks/use-long-press.ts",
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
        path: "registry/hooks/use-default.ts",
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
        path: "registry/hooks/use-click-away.ts",
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
        path: "registry/hooks/use-object-state.ts",
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
        path: "registry/hooks/use-logger.ts",
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
        path: "registry/hooks/use-speakup.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-measure-any",
    title: "Use Any Measure",
    description:
      "Measure the dimensions of any element with useMeasureAny, providing options to track changes and observe the element.",
    type: "registry:hook",
    dependencies: ["lucide-react"],
    files: [
      {
        path: "registry/hooks/use-measure-any.tsx",
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
        path: "registry/hooks/use-measure.ts",
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
        path: "registry/hooks/use-is-mobile.ts",
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
        path: "registry/hooks/use-lock-body-scroll.ts",
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
        path: "registry/hooks/use-mounted.ts",
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
        path: "registry/hooks/use-mutation-observer.ts",
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
        path: "registry/hooks/use-previous.ts",
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
        path: "registry/hooks/use-history-state.ts",
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
        path: "registry/hooks/use-async-status.ts",
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
        path: "registry/hooks/use-favicon.ts",
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
        path: "registry/hooks/use-list.ts",
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
        path: "registry/hooks/use-map.ts",
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
        path: "registry/hooks/use-queue.ts",
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
        path: "registry/hooks/use-set.ts",
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
        path: "registry/hooks/use-throttle.ts",
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
        path: "registry/hooks/use-continuous-retry.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-event-listener",
    title: "Use Event Listener",
    description: "Listen for events on a target element with useEventListener.",
    type: "registry:hook",
    registryDependencies: [`${siteConfig.url}/k/use-isomorphic-layout-effect`],
    files: [
      {
        path: "registry/hooks/use-event-listener.ts",
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
        path: "registry/hooks/use-random-interval.ts",
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
    registryDependencies: [`${siteConfig.url}/k/use-event-listener`],
    files: [
      {
        path: "registry/hooks/use-dropzone.ts",
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
        path: "registry/hooks/use-input-value.ts",
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
        path: "registry/hooks/use-step.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-draggable",
    title: "Use Draggable",
    description:
      "Create draggable elements with useDraggable, providing options to customize the drag behavior.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-draggable.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-stopwatch",
    title: "Use Stopwatch",
    description:
      "Create a stopwatch with useStopwatch, providing options to pause, play, reset, and toggle the stopwatch.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-stopwatch.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-location",
    title: "Use Location",
    description:
      "A hook that allows you to access and manage the current location in your application.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-location.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-auto-scroll",
    title: "Use Auto Scroll",
    description:
      "Use the useAutoScroll hook to automatically scroll an element into view when it is focused, with optional parameters for behavior and block alignment.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-auto-scroll.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-callback-ref",
    title: "Use Callback Ref",
    description:
      "A custom hook that converts a callback to a ref to avoid triggering re-renders when passed as a prop, or avoid re-executing effects when passed as a dependency.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-callback-ref.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-controlled-state",
    title: "Use Controlled State",
    description:
      "Manage a controlled state with the useControlledState hook, providing methods to set it to true, false, or toggle between them",
    type: "registry:hook",
    registryDependencies: [
      `${siteConfig.url}/k/use-callback-ref`,
      `${siteConfig.url}/k/use-uncontrolled-state`,
    ],
    files: [
      {
        path: "registry/hooks/use-controlled-state.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-uncontrolled-state",
    title: "Use Uncontrolled State",
    description:
      "Manage an uncontrolled state with the useUncontrolledState hook, providing methods to set it to true, false, or toggle between them",
    type: "registry:hook",
    registryDependencies: [`${siteConfig.url}/k/use-callback-ref`],
    files: [
      {
        path: "registry/hooks/use-uncontrolled-state.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-bluetooth",
    title: "Use Bluetooth",
    description:
      "Connect to Bluetooth devices and manage their state with useBluetooth.",
    type: "registry:hook",
    devDependencies: ["@types/web-bluetooth@0.0.21"],
    files: [
      {
        path: "registry/hooks/use-bluetooth.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-autosize-textarea",
    title: "Use Autosize Textarea",
    description:
      "Automatically resize a textarea to fit its content with useAutosizeTextarea.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-autosize-textarea.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-in-view",
    title: "Use In View",
    description:
      "Detect when an element is in the viewport with useInView, providing options for threshold and root margin.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-in-view.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-online-status",
    title: "Use Online Status",
    description:
      "Detect when the user is online or offline with useOnlineStatus, providing a boolean value.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-online-status.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-rerender",
    title: "Use Rerender",
    description:
      "Force a component to rerender with useRerender, providing a method to trigger the rerender.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-rerender.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-memory",
    title: "Use Memory",
    description:
      "Monitor the memory usage of a web page with useMemory, providing information about the JavaScript heap size.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-memory.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-encryption",
    title: "Use Encryption",
    description:
      "Encrypt and decrypt data with the useEncryption hook, providing methods to encrypt and decrypt strings using AES encryption.",
    type: "registry:hook",
    dependencies: ["crypto-js@4.2.0"],
    devDependencies: ["@types/crypto-js@4.2.2"],
    files: [
      {
        path: "registry/hooks/use-encryption.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-query-state",
    title: "Use Query State",
    description:
      "Manage query parameters in the URL with the useQueryState hook, providing methods to get, set, and remove query parameters.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-query-state.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-vibration",
    title: "Use Vibration",
    description:
      "Use the useVibration hook to control the vibration of a device, with options for duration and pattern.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-vibration.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-swipe",
    title: "Use Swipe",
    description:
      "Detect swipe gestures on touch devices with useSwipe, providing options for direction and threshold.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-swipe.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-fullscreen",
    title: "Use Fullscreen",
    description:
      "Manage fullscreen mode for a specific element or the entire document with useFullscreen.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-fullscreen.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-pinch-zoom",
    title: "Use Pinch Zoom",
    description:
      "Enable pinch-to-zoom functionality on touch devices with usePinchZoom, providing options for min and max scale.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-pinch-zoom.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-prevent-zoom",
    title: "Use Prevent Zoom",
    description:
      "Prevent zooming on touch devices with usePreventZoom, providing options for scroll, keyboard, and pinch prevention.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-prevent-zoom.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-portal",
    title: "Use Portal",
    description:
      "Create and manage portals for rendering content outside the component hierarchy.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-portal.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-render-debugger",
    title: "Use Render Debugger",
    description:
      "Logs prop/state changes between renders to help debug unnecessary re-renders.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-render-debugger.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-focus-trap",
    title: "Use Focus Trap",
    description:
      "Trap focus within a specific element, useful for modals and accessibility.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-focus-trap.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-socket",
    title: "Use Socket",
    description:
      "Manage Socket connections, handling messages, errors, and connection states.",
    type: "registry:hook",
    dependencies: ["socket.io-client@4.8.1"],
    files: [
      {
        path: "registry/hooks/use-socket.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-merge-refs",
    title: "Use Merge Refs",
    description: "Merge multiple refs into a single ref callback.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-merge-refs.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-time-ago",
    title: "Use Time Ago",
    description: "Format a date into a human-readable 'time ago' format.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-time-ago.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-clock",
    title: "Use Clock",
    description: "Display the current time and update it every second.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-clock.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-multi-step-form",
    title: "Use Multi Step Form",
    description: "Manage multi-step forms with the useMultiStepForm hook.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-multi-step-form.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-keyed-array",
    title: "Use Keyed Array",
    description:
      "Manage an array of objects with unique keys using the useKeyedArray hook.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-keyed-array.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-form",
    title: "Use Form",
    description:
      "Manage form state and validation with the useForm hook, providing methods to handle input changes, validation, and submission.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-form.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-infinite-scroll",
    title: "Use Infinite Scroll",
    description:
      "Implement infinite scrolling functionality with the useInfiniteScroll hook, allowing for dynamic loading of content as the user scrolls.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-infinite-scroll.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-breakpoint",
    title: "Use Breakpoint",
    description:
      "Detect and respond to changes in viewport size with the useBreakpoint hook, allowing for responsive design adjustments.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-breakpoint.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-pagination",
    title: "Use Pagination",
    description:
      "Manage pagination state and logic with the usePagination hook, providing methods to navigate through pages and track current page state.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-pagination.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-scroll-direction",
    title: "Use Scroll Direction",
    description:
      "Detect the direction of scrolling (up or down) with the useScrollDirection hook, allowing for dynamic UI adjustments based on scroll behavior.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-scroll-direction.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-scroll-to-top",
    title: "Use Scroll To Top",
    description:
      "Scroll the window or a specific element to the top with the useScrollToTop hook, providing options for smooth scrolling and custom behavior.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-scroll-to-top.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-execution-time",
    title: "Use Execution Time",
    description:
      "Measure the execution time of a function with the useExecutionTime hook, providing methods to start, stop, and get the elapsed time.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-execution-time.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-safe-state",
    title: "Use Safe State",
    description:
      "Safely manage state updates in React components with the useSafeState hook, preventing memory leaks and ensuring state consistency.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-safe-state.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-state-validator",
    title: "Use State Validator",
    description:
      "Validate state updates in React components with the useStateValidator hook, providing a way to ensure state changes meet specific criteria before being applied.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-state-validator.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-memoized-fn",
    title: "Use Memoized Function",
    description:
      "Memoize functions to prevent unnecessary re-computations with the useMemoizedFn hook, providing a way to optimize performance in React components.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-memoized-fn.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-text-direction",
    title: "Use Text Direction",
    description:
      "Detect and manage text direction (LTR or RTL) in React components with the useTextDirection hook, providing a way to adapt UI based on language directionality.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-text-direction.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-page-load-time",
    title: "Use Page Load Time",
    description:
      "Measure the time it takes for a page to load with the usePageLoadTime hook, providing insights into performance and user experience.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-page-load-time.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-time-of-day",
    title: "Use Time Of Day",
    description:
      "Determine the current time of day (morning, afternoon, evening, night) with the useTimeOfDay hook, allowing for dynamic UI adjustments based on the time.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-time-of-day.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-env-check",
    title: "Use Env Check",
    description:
      "Check the environment (development, production, test) in which the application is running with the useEnvCheck hook, allowing for environment-specific logic.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-env-check.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-error-boundary",
    title: "Use Error Boundary",
    description:
      "Handle errors in React components gracefully with the useErrorBoundary hook, providing a way to catch and display errors without crashing the application.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-error-boundary.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-dom-ready",
    title: "Use DOM Ready",
    description:
      "Detect when the DOM is fully loaded and ready for manipulation with the useDomReady hook, providing a way to execute code after the DOM is ready.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-dom-ready.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-device-detect",
    title: "Use Device Detect",
    description:
      "Detect the type of device (mobile, tablet, desktop) and its characteristics with the useDeviceDetect hook, providing a way to adapt UI and functionality based on the device type.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-device-detect.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-network-status",
    title: "Use Network Status",
    description:
      "Monitor the network status (online/offline) and connection type (WiFi, cellular) with the useNetworkStatus hook, providing a way to adapt functionality based on network conditions.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-network-status.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-update-effect",
    title: "Use Update Effect",
    description:
      "Run effects only when the component updates, not on the initial render, with the useUpdateEffect hook, providing a way to execute code after updates without affecting the initial render.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-update-effect.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-worker",
    title: "Use Worker",
    description:
      "Manage web workers in React components with the useWorker hook, providing a way to offload computationally expensive tasks to a separate thread.",
    type: "registry:hook",
    files: [
      {
        path: "registry/hooks/use-worker.ts",
        type: "registry:hook",
      },
    ],
  },
]

export default hooks
