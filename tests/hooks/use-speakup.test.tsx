import { act, renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  useTextToVoice,
  useVoiceToText,
} from "../../registry/hooks/use-speakup"

class MockSpeechRecognition {
  lang = "en-US"
  continuous = true
  interimResults = false
  maxAlternatives = 1
  onstart: (() => void) | null = null
  onend: (() => void) | null = null
  onerror: ((event: { error: string }) => void) | null = null
  onresult:
    | ((event: { results: Array<Array<{ transcript: string }>> }) => void)
    | null = null
  listening = false
  start = vi.fn(() => {
    this.listening = true
  })
  stop = vi.fn(() => {
    this.listening = false
  })
  abort = vi.fn()
}

class MockUtterance {
  pitch = 1
  rate = 1
  volume = 1
  voice: SpeechSynthesisVoice | null = null
  onstart: (() => void) | null = null
  onend: (() => void) | null = null
  onerror: ((event: { error: string }) => void) | null = null
  onpause: (() => void) | null = null
  onresume: (() => void) | null = null

  constructor(public text: string) {}
}

describe("useSpeakup", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it("captures voice input and can reset the transcript", async () => {
    class TestSpeechRecognition extends MockSpeechRecognition {
      static instance: MockSpeechRecognition | null = null

      constructor() {
        super()
        TestSpeechRecognition.instance = this
      }
    }

    vi.stubGlobal("SpeechRecognition", TestSpeechRecognition)

    Object.defineProperty(window, "SpeechRecognition", {
      configurable: true,
      value: globalThis.SpeechRecognition,
    })

    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: {
        getUserMedia: vi.fn().mockResolvedValue({}),
      },
    })

    const { result } = renderHook(() => useVoiceToText())

    await act(async () => {
      await result.current.retry()
    })

    expect(result.current.isSupported).toBe(true)

    act(() => {
      result.current.startListening()
      TestSpeechRecognition.instance?.onresult?.({
        results: [[{ transcript: "hello" }]],
      })
    })

    expect(result.current.isListening).toBe(true)
    expect(result.current.transcript).toContain("hello")

    act(() => {
      result.current.reset()
      result.current.stopListening()
    })

    expect(result.current.transcript).toBe("")
    expect(result.current.isListening).toBe(false)
  })

  it("speaks text with the speech synthesis API", () => {
    const speak = vi.fn((utterance: MockUtterance) => {
      utterance.onstart?.()
      utterance.onend?.()
    })

    vi.stubGlobal("SpeechSynthesisUtterance", MockUtterance)

    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        speak,
        pause: vi.fn(),
        resume: vi.fn(),
        cancel: vi.fn(),
        speaking: false,
        paused: false,
        getVoices: () => [{ name: "Test Voice" }],
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      },
    })

    const { result } = renderHook(() =>
      useTextToVoice({
        text: "Hello world",
      })
    )

    act(() => {
      result.current.speak()
    })

    expect(result.current.isSupported).toBe(true)
    expect(result.current.voices).toEqual(["Test Voice"])
    expect(speak).toHaveBeenCalledTimes(1)
    expect(result.current.isSpeaking).toBe(false)
  })
})
