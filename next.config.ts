import type { NextConfig } from "next"
import { createContentlayerPlugin } from "next-contentlayer2"

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/k/:name((?!index\\.json|hooks/).*)",
        destination: "/k/hooks/:name.json",
        permanent: true,
        missing: [
          {
            type: "query",
            key: "_redirected",
            value: undefined,
          },
        ],
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  webpack: (config) => {
    config.cache = false
    return config
  },
}

const withContentlayer = createContentlayerPlugin({})

export default withContentlayer(nextConfig)
