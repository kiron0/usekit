import * as React from "react"

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }

  class SpeechRecognition extends EventTarget {
    lang: string
    continuous: boolean
    interimResults: boolean
    maxAlternatives: number
    onstart: (() => void) | null
    onend: (() => void) | null
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
    onresult: ((event: SpeechRecognitionEvent) => void) | null
    start(): void
    stop(): void
    abort(): void
    listening: boolean
  }

  interface SpeechRecognitionErrorEvent extends Event {
    error:
      | "no-speech"
      | "aborted"
      | "audio-capture"
      | "network"
      | "not-allowed"
      | "service-not-allowed"
      | "bad-grammar"
      | "language-not-supported"
    message: string
  }

  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList
    resultIndex: number
  }

  interface SpeechRecognitionResultList {
    readonly length: number
    item(index: number): SpeechRecognitionResult
    [index: number]: SpeechRecognitionResult
  }

  interface SpeechRecognitionResult {
    readonly isFinal: boolean
    readonly length: number
    item(index: number): SpeechRecognitionAlternative
    [index: number]: SpeechRecognitionAlternative
  }

  interface SpeechRecognitionAlternative {
    readonly transcript: string
    readonly confidence: number
  }
}

interface VoiceToTextOptions {
  lang?: string
  continuous?: boolean
}

export const useVoiceToText = ({
  lang = "en-US",
  continuous = true,
}: VoiceToTextOptions = {}) => {
  const [transcript, setTranscript] = React.useState<string>("")
  const isContinuous = React.useRef<boolean>(continuous)
  const [isListening, setIsListening] = React.useState(false)

  const SpeechRecognition = React.useMemo(() => {
    if (typeof window === "undefined") {
      return null
    }
    return window.SpeechRecognition || window.webkitSpeechRecognition
  }, [])

  const recognition = React.useMemo(() => {
    if (SpeechRecognition) return new SpeechRecognition()
    else return null
  }, [SpeechRecognition])

  React.useEffect(() => {
    if (recognition && lang) recognition.lang = lang
  }, [recognition, lang])

  const startListening = React.useCallback(() => {
    if (!recognition) return
    if (recognition?.listening) return
    recognition?.start()
    isContinuous.current = continuous
  }, [recognition, continuous])

  const stopListening = React.useCallback(() => {
    if (!recognition) return
    recognition?.stop()
    isContinuous.current = false
    setIsListening(false)
  }, [recognition])

  const reset = React.useCallback(() => setTranscript(""), [])

  React.useEffect(() => {
    if (!recognition) return

    recognition.onend = () => {
      setIsListening(false)
      if (isContinuous.current) {
        startListening()
      }
    }
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error(`Speech recognition error: ${event.error}`)
      if (event.error === "no-speech") {
        stopListening()
      }
      setIsListening(false)
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      setTranscript((prev) => `${prev} ${event.results[0][0].transcript}`)
    }
  }, [recognition, startListening, stopListening])

  return {
    startListening,
    stopListening,
    isListening,
    transcript,
    reset,
    isSupported: !!recognition,
  }
}

enum NodeType {
  ELEMENT = 1,
  TEXT = 3,
}

interface TextToVoiceOptions {
  pitch?: number
  rate?: number
  volume?: number
}

export const useTextToVoice = <T extends HTMLElement>({
  pitch = 1,
  rate = 1,
  volume = 1,
}: TextToVoiceOptions = {}) => {
  const textRef = React.useRef<T>(null)
  const transcript = React.useRef<string>("")
  const [textContent, setTextContent] = React.useState<string>("")
  const [isSpeaking, setIsSpeaking] = React.useState(false)
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null

  const utter = React.useMemo(() => {
    if (!synth || typeof SpeechSynthesisUtterance === "undefined") return null
    return new SpeechSynthesisUtterance(textContent)
  }, [textContent, synth])

  const extractText = React.useCallback((node: Node | null) => {
    if (!node) return

    node.childNodes.forEach((child) => {
      if (child.nodeType === NodeType.TEXT) {
        transcript.current += child.textContent
      } else if (child.nodeType === NodeType.ELEMENT) {
        extractText(child)
      }
    })
  }, [])

  React.useEffect(() => {
    if (textRef.current) {
      transcript.current = ""
      extractText(textRef.current)
      setTextContent(transcript.current)
    }
  }, [extractText])

  React.useEffect(() => {
    if (!utter) return

    utter.pitch = pitch
    utter.rate = rate
    utter.volume = volume
  }, [utter, pitch, rate, volume])

  React.useEffect(() => {
    if (!utter) return

    utter.onend = () => setIsSpeaking(false)
    utter.onerror = (event) => {
      console.error(`Speech synthesis error: ${event.error}`)
    }
  }, [utter])

  const voices = React.useMemo(() => synth?.getVoices() || [], [synth])
  const voiceNames = React.useMemo(() => voices.map((v) => v.name), [voices])

  const speak = React.useCallback(() => {
    if (!synth || !utter) return

    synth.speak(utter)
    setIsSpeaking(true)
  }, [synth, utter])

  const pause = React.useCallback(() => {
    synth?.pause()
    setIsSpeaking(false)
  }, [synth])

  const resume = React.useCallback(() => {
    synth?.resume()
    setIsSpeaking(true)
  }, [synth])

  const setVoice = React.useCallback(
    (name: string) => {
      if (utter) {
        utter.voice = voices.find((v) => v.name === name) || null
      }
    },
    [utter, voices]
  )

  return {
    ref: textRef,
    speak,
    pause,
    resume,
    setVoice,
    voices: voiceNames,
    isSpeaking,
    isSupported: !!synth,
  }
}
