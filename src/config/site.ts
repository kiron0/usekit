export const siteConfig = {
  name: "useKit",
  url: "https://usekit.kiron.dev",
  description:
    "A collection of reusable react hooks that you can copy and paste into your apps.",
  slogan: "A collection of reusable react hooks",
  author: {
    name: "Toufiq Hasan Kiron",
  },
  links: {
    portfolio: "https://kiron.dev",
    twitter: "https://twitter.com/hashtagkiron",
    github: "https://github.com/kiron0",
  },
  keywords: [
    "react",
    "hooks",
    "typescript",
    "javascript",
    "web development",
    "frontend",
    "open source",
    "kit",
    "usekit",
    "use hooks",
    "usekit hooks",
    "usekit collection",
    "usekit typescript",
    "usekit javascript",
    "shadcn ui hooks",
    "usekit shadcn",
    "usekit shadcn ui",
    "usekit shadcn ui hooks",
    "usekit shadcn ui collection",
    "re-usable hooks",
    "re-usable react hooks",
  ],
  env: {
    node: process.env.NEXT_PUBLIC_NODE_ENV! as "production" | "development",
    apiUrl: process.env.NEXT_PUBLIC_BASE_API_URL!,
  },
}

export type SiteConfig = typeof siteConfig

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
}
