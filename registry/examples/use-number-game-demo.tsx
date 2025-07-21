"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { useConfetti } from "@/hooks/use-confetti"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useNumberGame } from "registry/hooks/use-number-game"

const createGuessSchema = (min: number, max: number) => {
  return z.object({
    number: z
      .number()
      .min(min, { message: `Number must be at least ${min}` })
      .max(max, { message: `Number should not exceed ${max}` })
      .or(z.undefined()),
  })
}

const DEFAULT_VALUE = {
  maxAttempts: 10,
  revealTarget: false,
  min: 1,
  max: 100,
}

export default function UseNumberGameDemo() {
  const [value, setValue] = React.useState([
    DEFAULT_VALUE.min,
    DEFAULT_VALUE.max,
  ])
  const [maxAttempts, setMaxAttempts] = React.useState(
    DEFAULT_VALUE.maxAttempts
  )
  const [revealTarget, setRevealTarget] = React.useState(
    DEFAULT_VALUE.revealTarget
  )
  const [toggleHistory, setToggleHistory] = React.useState(false)
  const [confettiTrigger, setConfettiTrigger] = React.useState(false)

  useConfetti(confettiTrigger, 200)

  const guessSchema = createGuessSchema(value[0], value[1])

  type GuessFormValues = z.infer<typeof guessSchema>

  const form = useForm<GuessFormValues>({
    resolver: zodResolver(guessSchema),
    defaultValues: { number: value[0] },
  })

  const {
    guess,
    message,
    attempts,
    makeGuess,
    resetGame,
    gameOver,
    hasWon,
    hasLost,
    targetNumber,
    history,
  } = useNumberGame({
    maxAttempts,
    revealTarget,
    min: value[0],
    max: value[1],
  })

  const onSubmit = (values: GuessFormValues) => {
    if (typeof values.number === "number") {
      makeGuess(values.number)
    }
    form.reset()
  }

  const handleReset = () => {
    resetGame()
    form.reset()
  }

  React.useEffect(() => {
    if (hasWon) {
      setConfettiTrigger(true)
      setTimeout(() => setConfettiTrigger(false), 3000)
    }
  }, [hasWon])

  return (
    <div className="flex w-full max-w-md flex-col items-center justify-center gap-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Number Guessing Game</h1>
        <p className="text-base font-medium">{!gameOver && message}</p>
      </div>

      {gameOver ? (
        <div className="space-y-3 text-center">
          <p
            className={cn(
              "text-base font-medium",
              hasWon
                ? "text-green-600"
                : hasLost
                  ? "text-destructive"
                  : "text-muted-foreground"
            )}
          >
            {hasWon && "🎉 You Win!"}
            {hasLost && "😢 You Lost!"}
          </p>
          <p className="text-lg font-semibold">
            {hasWon ? "🎊 Congratulations!" : "💀 Better luck next time!"}
          </p>
          <Button onClick={handleReset} variant="secondary">
            Play Again
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <div className="flex w-full items-center gap-2">
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={`Guess a number between ${value[0]} and ${value[1]}!`}
                        min={value[0]}
                        max={value[1]}
                        value={field.value}
                        onChange={(e) => {
                          const val = e.target.value
                          field.onChange(parseInt(val))
                        }}
                      />
                    </FormControl>
                    <Button
                      type="submit"
                      disabled={gameOver || hasWon || hasLost}
                    >
                      Guess
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      )}

      <div className="w-full space-y-4">
        {!gameOver && (
          <div className="flex w-full flex-col items-center gap-4">
            <div className="flex w-full flex-col items-start space-y-3">
              <Label>
                Range:{" "}
                <span className="font-semibold text-primary">{value[0]}</span> -{" "}
                <span className="font-semibold text-primary">{value[1]}</span>
              </Label>
              <Slider
                value={value}
                min={DEFAULT_VALUE.min}
                max={DEFAULT_VALUE.max}
                step={1}
                onValueChange={setValue}
                aria-label="Dual range slider with output"
                className="w-full"
              />
            </div>
            <div className="mt-4 flex min-w-max items-center gap-2 sm:mt-0">
              <Checkbox
                id="reveal-target"
                checked={revealTarget}
                onCheckedChange={(checked) =>
                  checked
                    ? setRevealTarget(checked as boolean)
                    : setRevealTarget(false)
                }
              />
              <label
                htmlFor="reveal-target"
                className="cursor-pointer select-none text-sm font-medium"
              >
                Reveal Target
              </label>
            </div>
            {attempts === 0 && (
              <div className="flex w-full flex-col items-center gap-2">
                <Label htmlFor="max-attempts">Max Attempts</Label>
                <Input
                  id="max-attempts"
                  type="number"
                  min={1}
                  max={50}
                  value={maxAttempts}
                  onChange={(e) => setMaxAttempts(Number(e.target.value))}
                  className="w-20 text-center"
                />
              </div>
            )}
          </div>
        )}
        <div className="flex flex-wrap items-center justify-center gap-6">
          <span className="text-sm text-muted-foreground">
            Attempts:{" "}
            <span className="font-semibold text-primary">{attempts}</span>
          </span>
          <span className="text-sm text-muted-foreground">
            Remaining:{" "}
            <span className="font-semibold text-primary">
              {maxAttempts - attempts}
            </span>
          </span>
          {revealTarget && !gameOver && (
            <div className="text-sm text-muted-foreground">
              Target: <Badge variant="destructive">{targetNumber}</Badge>
            </div>
          )}
          {guess !== null && !gameOver && (
            <span className="text-sm text-muted-foreground">
              Last Guess: <span className="font-semibold">{guess}</span>
            </span>
          )}
        </div>
      </div>

      {history.length > 0 && (
        <div className="flex items-center justify-center">
          <Button
            variant="outline"
            onClick={() => setToggleHistory((prev) => !prev)}
          >
            {toggleHistory ? "Hide History" : "Show Guess History"}
          </Button>
        </div>
      )}

      {toggleHistory && history.length > 0 && (
        <div className="w-full pt-4">
          <h2 className="mb-2 text-center font-semibold">Guess History</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guess</TableHead>
                <TableHead>Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>{entry.guess}</TableCell>
                  <TableCell>{entry.label}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
