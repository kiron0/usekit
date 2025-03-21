"use client"

import { useMeasure } from "registry/hooks/use-measure"

export default function UseMeasureDemo() {
  const [ref, { width }] = useMeasure()

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <p className="text-neutral-600 dark:text-neutral-400">
        (Resize the rulers)
      </p>
      <article
        ref={ref}
        className="border border-neutral-400/30 p-4"
        style={{
          //@ts-ignore
          "--color": "rgba(128, 128, 128, 0.5)",
          resize: "horizontal",
          background: "var(--color)",
          backgroundRepeat: "no-repeat",
          backgroundImage:
            "repeating-linear-gradient(to right, var(--color), var(--color) 1px, transparent 1px, transparent 10px), repeating-linear-gradient(to right, var(--color), var(--color) 1px, transparent 1px, transparent 60px)",
          backgroundSize: "100% 10px, 100% 20px",
          height: "64px",
          minWidth: "200px",
          margin: "auto",
          borderRadius: "4px",
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {width && <p>width: {Math.floor(width)} px</p>}
      </article>
    </div>
  )
}
