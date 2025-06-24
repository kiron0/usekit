import * as React from "react"

interface Return {
  isBrowser: boolean
  isServer: boolean
  isTest: boolean
  isDev: boolean
  isProd: boolean
  isEnv: (env: "browser" | "server" | "test" | "dev" | "prod") => boolean
}

export function useEnvCheck(): Return {
  const env = React.useMemo((): Return => {
    const isBrowser = typeof window !== "undefined"
    const isServer = !isBrowser
    const nodeEnv = process.env.NODE_ENV
    const isTest = nodeEnv === "test"
    const isDev = nodeEnv === "development"
    const isProd = nodeEnv === "production"

    return {
      isBrowser,
      isServer,
      isTest,
      isDev,
      isProd,
      isEnv: (env) =>
        env === "browser"
          ? isBrowser
          : env === "server"
            ? isServer
            : env === "test"
              ? isTest
              : env === "dev"
                ? isDev
                : isProd,
    }
  }, [])

  return env
}
