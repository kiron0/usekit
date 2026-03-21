import * as React from "react"

type MaskPattern = string | Array<string | RegExp>

interface UseMaskedInputOptions {
  placeholderChar?: string
  onAccept?: (value: string) => void
  onComplete?: (value: string) => void
}

type Token =
  | {
      kind: "literal"
      value: string
    }
  | {
      kind: "dynamic"
      matcher: (char: string) => boolean
    }

const TOKEN_MAP: Record<string, RegExp> = {
  "9": /\d/,
  A: /[A-Za-z]/,
  X: /[A-Za-z0-9]/,
  "*": /[\s\S]/,
}

export function useMaskedInput(
  ref: React.RefObject<HTMLInputElement | null>,
  maskPattern: MaskPattern,
  options: UseMaskedInputOptions = {}
) {
  const {
    placeholderChar = "",
    onAccept,
    onComplete,
  } = options
  const tokens = React.useMemo(
    () => normalizePattern(maskPattern),
    [maskPattern]
  )

  const applyMask = React.useCallback(
    (value: string) => {
      const raw = extractRawValue(value, tokens)
      return maskFromRaw(raw, tokens, placeholderChar)
    },
    [tokens, placeholderChar]
  )

  React.useEffect(() => {
    const input = ref.current
    if (!input) return

    const commitValue = (incoming: string) => {
      const masked = applyMask(incoming)
      input.value = masked.value
      requestAnimationFrame(() => {
        const caret = masked.value.length
        input.setSelectionRange(caret, caret)
      })
      onAccept?.(masked.raw)
      if (masked.complete) {
        onComplete?.(masked.raw)
      }
    }

    const handleInput = (event: Event) => {
      const target = event.target as HTMLInputElement
      commitValue(target.value)
    }

    const handlePaste = (event: ClipboardEvent) => {
      event.preventDefault()
      const data = event.clipboardData?.getData("text") ?? ""
      commitValue(data)
    }

    commitValue(input.value)
    input.addEventListener("input", handleInput)
    input.addEventListener("paste", handlePaste)

    return () => {
      input.removeEventListener("input", handleInput)
      input.removeEventListener("paste", handlePaste)
    }
  }, [ref, applyMask, onAccept, onComplete])

  return {
    mask: (value: string) => applyMask(value).value,
    unmask: (value: string) => extractRawValue(value, tokens),
  }
}

function normalizePattern(pattern: MaskPattern): Token[] {
  if (Array.isArray(pattern)) {
    return pattern.map((token) => toToken(token))
  }

  return pattern.split("").map((char) => toToken(char))
}

function toToken(token: string | RegExp): Token {
  if (token instanceof RegExp) {
    return {
      kind: "dynamic",
      matcher: (char: string) => token.test(char),
    }
  }

  const matcher = TOKEN_MAP[token]
  if (matcher) {
    return {
      kind: "dynamic",
      matcher: (char: string) => matcher.test(char),
    }
  }

  return {
    kind: "literal",
    value: token,
  }
}

function extractRawValue(value: string, tokens: Token[]) {
  const matchers = tokens.filter((token) => token.kind === "dynamic") as Array<
    Extract<Token, { kind: "dynamic" }>
  >

  if (!matchers.length) return value

  return value
    .split("")
    .filter((char) => matchers.some((token) => token.matcher(char)))
    .join("")
}

function maskFromRaw(
  raw: string,
  tokens: Token[],
  placeholderChar: string
): { value: string; raw: string; complete: boolean } {
  let rawIndex = 0
  let pendingLiteral = ""
  let masked = ""
  let consumed = ""
  let matchedSegments = 0
  const dynamicSegments = tokens.filter(
    (token) => token.kind === "dynamic"
  ).length

  tokens.forEach((token) => {
    if (token.kind === "literal") {
      pendingLiteral += token.value
      return
    }

    let matchedChar = ""
    while (rawIndex < raw.length) {
      const candidate = raw[rawIndex]
      rawIndex += 1
      if (token.matcher(candidate)) {
        matchedChar = candidate
        break
      }
    }

    if (matchedChar) {
      masked += pendingLiteral + matchedChar
      pendingLiteral = ""
      consumed += matchedChar
      matchedSegments += 1
    } else if (placeholderChar) {
      masked += pendingLiteral + placeholderChar
      pendingLiteral = ""
    }
  })

  if (matchedSegments === dynamicSegments) {
    masked += pendingLiteral
  }

  return {
    value: masked,
    raw: consumed,
    complete: matchedSegments === dynamicSegments,
  }
}
