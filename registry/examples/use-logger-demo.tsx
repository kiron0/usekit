import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useLogger } from "registry/hooks/use-logger"

interface FirstChildProps {
  name: string
  isActive: boolean
  count: number
}

function FirstChild(props: FirstChildProps) {
  useLogger(props.name, props)

  return (
    <div
      className={cn(
        "w-full rounded-xl border p-4 text-center",
        props.isActive
          ? "bg-primary text-primary-foreground"
          : "bg-background text-foreground",
        props.name === "Third" && "col-span-2 md:col-span-1"
      )}
    >
      <p className="text-2xl font-bold">{props.count}</p>
      <h5>{props.name}</h5>
    </div>
  )
}

export default function UseLoggerDemo() {
  const [count, setCount] = React.useState(0)

  const handleClick = () => setCount(count + 1)

  return (
    <div className="flex w-full flex-col items-center justify-center gap-6">
      <h6>(Check the console)</h6>
      <Button onClick={handleClick}>Increment Count</Button>
      <div className="grid w-full grid-cols-2 gap-2 md:grid-cols-3">
        {["First", "Second", "Third"].map((item, index) => {
          const isActive = count % 3 === index
          return (
            <FirstChild
              key={index}
              name={item}
              isActive={isActive}
              count={count}
            />
          )
        })}
      </div>
    </div>
  )
}
