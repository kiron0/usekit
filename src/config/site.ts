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
    portfolio: "https://toufiqhasankiron.com",
    twitter: "https://twitter.com/hashtagkiron",
    github: "https://github.com/kiron0",
  },
  keywords: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "Server Components",
    "Radix UI",
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
