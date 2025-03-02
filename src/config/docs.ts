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
      ],
    },
  ],
}
