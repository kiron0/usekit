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
          title: "Use Boolean",
          href: "/docs/hooks/use-boolean",
          items: [],
        },
        {
          title: "Use Debounce Callback",
          href: "/docs/hooks/use-debounce-callback",
          items: [],
        },
        {
          title: "Use Fetch",
          href: "/docs/hooks/use-fetch",
          items: [],
          label: "New",
        },
        {
          title: "Use Copy To Clipboard",
          href: "/docs/hooks/use-copy-to-clipboard",
          items: [],
        },
        {
          title: "Use Unmount",
          href: "/docs/hooks/use-unmount",
          items: [],
        },
        {
          title: "Use Toggle",
          href: "/docs/hooks/use-toggle",
          items: [],
        },
        {
          title: "Use Isomorphic Layout Effect",
          href: "/docs/hooks/use-isomorphic-layout-effect",
          items: [],
        },
        {
          title: "Use Interval",
          href: "/docs/hooks/use-interval",
          items: [],
        },
        {
          title: "Use Timeout",
          href: "/docs/hooks/use-timeout",
          items: [],
        },
        {
          title: "Use Document Title",
          href: "/docs/hooks/use-document-title",
          items: [],
        },
        {
          title: "Use Counter",
          href: "/docs/hooks/use-counter",
          items: [],
        },
        {
          title: "Use Mouse Position",
          href: "/docs/hooks/use-mouse-position",
          items: [],
        },
        {
          title: "Use Battery",
          href: "/docs/hooks/use-battery",
          items: [],
          label: "New",
        },
        {
          title: "Use Local Storage",
          href: "/docs/hooks/use-local-storage",
          items: [],
          label: "New",
        },
        {
          title: "Use Session Storage",
          href: "/docs/hooks/use-session-storage",
          items: [],
          label: "New",
        },
      ],
    },
  ],
}
