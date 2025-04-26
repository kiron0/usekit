import type { MainNavItem, SidebarNavItem } from "@/types/nav"

import { siteConfig } from "./site"

export interface DocsConfig {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Docs",
      href: "/docs",
    },
  ],
  sidebarNav: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/docs",
          items: [],
        },
        {
          title: "Installation",
          href: "/docs/installation",
          items: [],
        },
        {
          title: "Hooks",
          href: "/docs/hooks",
          items: [],
        },
        ...(siteConfig.env.node === "development"
          ? [
              {
                title: "Development",
                href: "/docs/development",
                items: [],
                label: "alpha",
              },
            ]
          : []),
      ],
    },
    {
      title: "Hooks",
      items: [
        {
          title: "useBoolean",
          href: "/docs/hooks/use-boolean",
          items: [],
        },
        {
          title: "useDebounceCallback",
          href: "/docs/hooks/use-debounce-callback",
          items: [],
        },
        {
          title: "useFetch",
          href: "/docs/hooks/use-fetch",
          items: [],
        },
        {
          title: "useCopyToClipboard",
          href: "/docs/hooks/use-copy-to-clipboard",
          items: [],
        },
        {
          title: "useMounted",
          href: "/docs/hooks/use-mounted",
          items: [],
        },
        {
          title: "useUnmount",
          href: "/docs/hooks/use-unmount",
          items: [],
        },
        {
          title: "useToggle",
          href: "/docs/hooks/use-toggle",
          items: [],
        },
        {
          title: "useIsomorphicLayoutEffect",
          href: "/docs/hooks/use-isomorphic-layout-effect",
          items: [],
        },
        {
          title: "useInterval",
          href: "/docs/hooks/use-interval",
          items: [],
        },
        {
          title: "useBattery",
          href: "/docs/hooks/use-battery",
          items: [],
        },
        {
          title: "useTimeout",
          href: "/docs/hooks/use-timeout",
          items: [],
        },
        {
          title: "useFavicon",
          href: "/docs/hooks/use-favicon",
          items: [],
        },
        {
          title: "useDocumentTitle",
          href: "/docs/hooks/use-document-title",
          items: [],
        },
        {
          title: "useLocalStorage",
          href: "/docs/hooks/use-local-storage",
          items: [],
        },
        {
          title: "useCounter",
          href: "/docs/hooks/use-counter",
          items: [],
        },
        {
          title: "useMousePosition",
          href: "/docs/hooks/use-mouse-position",
          items: [],
        },
        {
          title: "useSessionStorage",
          href: "/docs/hooks/use-session-storage",
          items: [],
        },
        {
          title: "useScript",
          href: "/docs/hooks/use-script",
          items: [],
        },
        {
          title: "useScramble",
          href: "/docs/hooks/use-scramble",
          items: [],
        },
        {
          title: "useIntersectionObserver",
          href: "/docs/hooks/use-intersection-observer",
          items: [],
        },
        {
          title: "useRenderCount",
          href: "/docs/hooks/use-render-count",
          items: [],
        },
        {
          title: "useOrientation",
          href: "/docs/hooks/use-orientation",
          items: [],
        },
        {
          title: "useWindowSize",
          href: "/docs/hooks/use-window-size",
          items: [],
        },
        {
          title: "useHover",
          href: "/docs/hooks/use-hover",
          items: [],
        },
        {
          title: "useMediaQuery",
          href: "/docs/hooks/use-media-query",
          items: [],
        },
        {
          title: "useIntervalWhen",
          href: "/docs/hooks/use-interval-when",
          items: [],
        },
        {
          title: "useCountdown",
          href: "/docs/hooks/use-countdown",
          items: [],
        },
        {
          title: "useVisibilityChange",
          href: "/docs/hooks/use-visibility-change",
          items: [],
        },
        {
          title: "useKeyPress",
          href: "/docs/hooks/use-key-press",
          items: [],
        },
        {
          title: "useCookieStorage",
          href: "/docs/hooks/use-cookie-storage",
          items: [],
        },
        {
          title: "useIsClient",
          href: "/docs/hooks/use-is-client",
          items: [],
        },
        {
          title: "useGeolocation",
          href: "/docs/hooks/use-geolocation",
          items: [],
        },
        {
          title: "useIsMobile",
          href: "/docs/hooks/use-is-mobile",
          items: [],
        },
        {
          title: "usePageLeave",
          href: "/docs/hooks/use-page-leave",
          items: [],
        },
        {
          title: "useLockBodyScroll",
          href: "/docs/hooks/use-lock-body-scroll",
          items: [],
        },
        {
          title: "useIsFirstRender",
          href: "/docs/hooks/use-is-first-render",
          items: [],
        },
        {
          title: "useWindowScroll",
          href: "/docs/hooks/use-window-scroll",
          items: [],
        },
        {
          title: "useIdle",
          href: "/docs/hooks/use-idle",
          items: [],
        },
        {
          title: "useLongPress",
          href: "/docs/hooks/use-long-press",
          items: [],
        },
        {
          title: "useDefault",
          href: "/docs/hooks/use-default",
          items: [],
        },
        {
          title: "useMeasure",
          href: "/docs/hooks/use-measure",
          items: [],
        },
        {
          title: "useClickAway",
          href: "/docs/hooks/use-click-away",
          items: [],
        },
        {
          title: "useObjectState",
          href: "/docs/hooks/use-object-state",
          items: [],
        },
        {
          title: "useLogger",
          href: "/docs/hooks/use-logger",
          items: [],
        },
        {
          title: "useSpeakup",
          href: "/docs/hooks/use-speakup",
          items: [],
        },
        {
          title: "useMeasureAny",
          href: "/docs/hooks/use-measure-any",
          items: [],
        },
        {
          title: "useMutationObserver",
          href: "/docs/hooks/use-mutation-observer",
          items: [],
        },
        {
          title: "usePrevious",
          href: "/docs/hooks/use-previous",
          items: [],
        },
        {
          title: "useAsyncStatus",
          href: "/docs/hooks/use-async-status",
          items: [],
        },
        {
          title: "useHistoryState",
          href: "/docs/hooks/use-history-state",
          items: [],
        },
        {
          title: "useList",
          href: "/docs/hooks/use-list",
          items: [],
        },
        {
          title: "useMap",
          href: "/docs/hooks/use-map",
          items: [],
        },
        {
          title: "useQueue",
          href: "/docs/hooks/use-queue",
          items: [],
        },
        {
          title: "useSet",
          href: "/docs/hooks/use-set",
          items: [],
        },
        {
          title: "useThrottle",
          href: "/docs/hooks/use-throttle",
          items: [],
        },
        {
          title: "useContinuousRetry",
          href: "/docs/hooks/use-continuous-retry",
          items: [],
        },
        {
          title: "useEventListener",
          href: "/docs/hooks/use-event-listener",
          items: [],
        },
        {
          title: "useRandomInterval",
          href: "/docs/hooks/use-random-interval",
          items: [],
        },
        {
          title: "useAutoScroll",
          href: "/docs/hooks/use-auto-scroll",
          items: [],
        },
        {
          title: "useBluetooth",
          href: "/docs/hooks/use-bluetooth",
          items: [],
        },
        {
          title: "useDraggable",
          href: "/docs/hooks/use-draggable",
          items: [],
        },
        {
          title: "useDropzone",
          href: "/docs/hooks/use-dropzone",
          items: [],
        },
        {
          title: "useInView",
          href: "/docs/hooks/use-in-view",
          items: [],
        },
        {
          title: "useInputValue",
          href: "/docs/hooks/use-input-value",
          items: [],
        },
        {
          title: "useLocation",
          href: "/docs/hooks/use-location",
          items: [],
        },
        {
          title: "useMemory",
          href: "/docs/hooks/use-memory",
          items: [],
        },
        {
          title: "useStep",
          href: "/docs/hooks/use-step",
          items: [],
        },
        {
          title: "useRerender",
          href: "/docs/hooks/use-rerender",
          items: [],
        },
        {
          title: "useOnlineStatus",
          href: "/docs/hooks/use-online-status",
          items: [],
        },
        {
          title: "useStopwatch",
          href: "/docs/hooks/use-stopwatch",
          items: [],
        },
        {
          title: "useAutosizeTextarea",
          href: "/docs/hooks/use-autosize-textarea",
          items: [],
        },
        {
          title: "useCallbackRef",
          href: "/docs/hooks/use-callback-ref",
          items: [],
        },
        {
          title: "useControlledState",
          href: "/docs/hooks/use-controlled-state",
          items: [],
        },
        {
          title: "useUncontrolledState",
          href: "/docs/hooks/use-uncontrolled-state",
          items: [],
        },
        {
          title: "useEncryption",
          href: "/docs/hooks/use-encryption",
          items: [],
        },
        {
          title: "useQueryState",
          href: "/docs/hooks/use-query-state",
          items: [],
        },
        {
          title: "useVibration",
          href: "/docs/hooks/use-vibration",
          items: [],
          label: "Soon",
        },
        {
          title: "useSwipe",
          href: "/docs/hooks/use-swipe",
          items: [],
          label: "Soon",
        },
        {
          title: "useFullscreen",
          href: "/docs/hooks/use-fullscreen",
          items: [],
          label: "Soon",
        },
        {
          title: "usePreventZoom",
          href: "/docs/hooks/use-prevent-zoom",
          items: [],
        },
        {
          title: "usePinchZoom",
          href: "/docs/hooks/use-pinch-zoom",
          items: [],
          label: "Soon",
        },
        {
          title: "useWebSocket",
          href: "/docs/hooks/use-web-socket",
          items: [],
          label: "Soon",
        },
        {
          title: "usePortal",
          href: "/docs/hooks/use-portal",
          items: [],
          label: "Soon",
        },
        {
          title: "useFocusTrap",
          href: "/docs/hooks/use-focus-trap",
          items: [],
          label: "Soon",
        },
        {
          title: "usePrefersDarkMode",
          href: "/docs/hooks/use-prefers-dark-mode",
          items: [],
          label: "Soon",
        },
        {
          title: "useWhyDidYouUpdate",
          href: "/docs/hooks/use-why-did-you-update",
          items: [],
          label: "Soon",
        },
      ],
    },
    {
      title: "Contribute",
      items: [
        {
          title: "Report an issue",
          href: "/docs/report",
          items: [],
        },
        {
          title: "Request a feature",
          href: "/docs/feature",
          items: [],
        },
      ],
    },
  ],
}
