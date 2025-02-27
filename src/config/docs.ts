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
      title: "Hooks",
      href: "/docs/hooks/use-boolean",
    },
  ],
  sidebarNav: [
    {
      title: "hooks",
      items: [
        {
          title: "useBoolean",
          href: "/docs/hooks/use-boolean",
          items: [],
        },
        {
          title: "useToggle",
          href: "/docs/hooks/use-toggle",
          items: [],
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
          title: "useDebounceCallback",
          href: "/docs/hooks/use-debounce-callback",
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
          title: "useBattery",
          href: "/docs/hooks/use-battery",
          items: [],
        },
        {
          title: "useFetch",
          href: "/docs/hooks/use-fetch",
          items: [],
        },
      ],
    },
  ],
}
