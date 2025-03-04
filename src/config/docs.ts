import type { MainNavItem, SidebarNavItem } from "@/types/nav"

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
      ],
    },
    {
      title: "hooks",
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
          label: "New",
        },
        {
          title: "useCopyToClipboard",
          href: "/docs/hooks/use-copy-to-clipboard",
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
          label: "New",
        },
        {
          title: "useTimeout",
          href: "/docs/hooks/use-timeout",
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
          label: "New",
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
          label: "New",
        },
        {
          title: "useScript",
          href: "/docs/hooks/use-script",
          items: [],
          label: "New",
        },
        {
          title: "useScramble",
          href: "/docs/hooks/use-scramble",
          items: [],
          label: "New",
        },
        {
          title: "useIntersectionObserver",
          href: "/docs/hooks/use-intersection-observer",
          items: [],
          label: "New",
        },
        {
          title: "useRenderCount",
          href: "/docs/hooks/use-render-count",
          items: [],
          label: "New",
        },
        {
          title: "useOrientation",
          href: "/docs/hooks/use-orientation",
          items: [],
          label: "New",
        },
        {
          title: "useWindowSize",
          href: "/docs/hooks/use-window-size",
          items: [],
          label: "New",
        },
        {
          title: "useHover",
          href: "/docs/hooks/use-hover",
          items: [],
          label: "New",
        },
        {
          title: "useMediaQuery",
          href: "/docs/hooks/use-media-query",
          items: [],
          label: "New",
        },
        {
          title: "useIntervalWhen",
          href: "/docs/hooks/use-interval-when",
          items: [],
          label: "New",
        },
        {
          title: "useCountdown",
          href: "/docs/hooks/use-countdown",
          items: [],
          label: "New",
        },
        {
          title: "useVisibilityChange",
          href: "/docs/hooks/use-visibility-change",
          items: [],
          label: "New",
        },
        {
          title: "useKeyPress",
          href: "/docs/hooks/use-key-press",
          items: [],
          label: "New",
        },
        {
          title: "useCookieStorage",
          href: "/docs/hooks/use-cookie-storage",
          items: [],
          label: "New",
        },
        {
          title: "useIsClient",
          href: "/docs/hooks/use-is-client",
          items: [],
          label: "New",
        },
        {
          title: "useGeolocation",
          href: "/docs/hooks/use-geolocation",
          items: [],
          label: "New",
        },
        {
          title: "usePageLeave",
          href: "/docs/hooks/use-page-leave",
          items: [],
          label: "New",
        },
        {
          title: "useIsFirstRender",
          href: "/docs/hooks/use-is-first-render",
          items: [],
          label: "New",
        },
        {
          title: "useIdle",
          href: "/docs/hooks/use-idle",
          items: [],
          label: "Soon",
        },
        {
          title: "useLogger",
          href: "/docs/hooks/use-logger",
          items: [],
          label: "Soon",
        },
        {
          title: "useWindowScroll",
          href: "/docs/hooks/use-window-scroll",
          items: [],
          label: "Soon",
        },
        {
          title: "useClickAway",
          href: "/docs/hooks/use-click-away",
          items: [],
          label: "Soon",
        },
        {
          title: "useDefault",
          href: "/docs/hooks/use-default",
          items: [],
          label: "Soon",
        },
        {
          title: "useLongPress",
          href: "/docs/hooks/use-long-press",
          items: [],
          label: "Soon",
        },
        {
          title: "useObjectState",
          href: "/docs/hooks/use-object-state",
          items: [],
          label: "Soon",
        },
      ],
    },
  ],
}
