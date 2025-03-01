"use client"

import { useCounter } from "registry/hooks/use-counter"

import { Button } from "@/components/ui/button"

export default function UseCounterDemo() {
  const { count, setCount, increment, decrement, reset } = useCounter(0)

  const multiplyBy2 = () => {
    setCount((x: number) => x * 2)
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <h1 className="text-2xl font-bold">Counter</h1>
      <p className="text-4xl font-bold">{count}</p>
      <div className="flex justify-center flex-wrap gap-2">
        <Button onClick={increment}>Increment</Button>
        <Button onClick={decrement}>Decrement</Button>
        <Button onClick={reset}>Reset</Button>
        <Button onClick={multiplyBy2}>Multiply by 2</Button>
      </div>
    </div>
  )
}
