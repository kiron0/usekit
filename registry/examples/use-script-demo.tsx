"use client"

import * as React from "react"
import { useScript } from "registry/use-script/use-script"

declare global {
  interface Window {
    MooTools: {
      build: string
      version: string
    }
  }
}

export default function UseScriptDemo() {
  const [status, setStatus] = React.useState<{
    status: "loading" | "ready" | "error" | "unknown"
    mooTools: {
      build: string
      version: string
    }
  }>()

  const script = useScript(
    "https://cdnjs.cloudflare.com/ajax/libs/mootools/1.6.0/mootools-core.js",
    {
      removeOnUnmount: true,
    }
  )

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setStatus({
        status: script,
        mooTools: {
          build: window.MooTools?.build || "",
          version: window.MooTools?.version || "",
        },
      })
    }
  }, [script])

  const isReady = status?.status === "ready"

  return (
    <section className="flex flex-col justify-center items-center gap-4">
      <h1>useScript</h1>
      <table className="table-auto border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Property</th>
            <th className="border border-gray-300 px-4 py-2">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Status</td>
            <td className="border border-gray-300 px-4 py-2">
              {status?.status}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Build</td>
            <td className="border border-gray-300 px-4 py-2">
              {isReady ? (
                <span className="text-green-500">
                  {status?.mooTools.build?.length > 20
                    ? `${status?.mooTools.build.slice(0, 20)}...`
                    : status?.mooTools.build}
                </span>
              ) : (
                <span className="text-red-500">Not Ready</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Version</td>
            <td className="border border-gray-300 px-4 py-2">
              {isReady ? (
                <span className="text-green-500">
                  {status?.mooTools.version}
                </span>
              ) : (
                <span className="text-red-500">Not Ready</span>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  )
}
