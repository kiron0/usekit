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

interface TextToVoiceOptions {
  text?: string
  pitch?: number
  rate?: number
  volume?: number
  onError?: (error: string) => void
}

export const useTextToVoice = ({
  text = "",
  pitch = 1,
  rate = 1,
  volume = 1,
  onError,
}: TextToVoiceOptions = {}) => {
  const [isSpeaking, setIsSpeaking] = React.useState(false)
  const [isPaused, setIsPaused] = React.useState(false)
  const [voices, setVoices] = React.useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] =
    React.useState<SpeechSynthesisVoice | null>(null)
  const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null)

  const synth = React.useMemo(() => {
    if (typeof window === "undefined") return null
    return window.speechSynthesis
  }, [])

  React.useEffect(() => {
    if (!synth) return

    const updateVoices = () => {
      const voices = synth.getVoices()
      setVoices(voices)
    }

    updateVoices()
    synth.addEventListener("voiceschanged", updateVoices)
    return () => synth.removeEventListener("voiceschanged", updateVoices)
  }, [synth])

  const createUtterance = React.useCallback(() => {
    if (!synth || !text) return null

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.pitch = pitch
    utterance.rate = rate
    utterance.volume = volume
    utterance.voice = selectedVoice

    utterance.onstart = () => {
      setIsSpeaking(true)
      setIsPaused(false)
    }

    utterance.onend = () => {
      setIsSpeaking(false)
      setIsPaused(false)
    }

    utterance.onerror = (event) => {
      onError?.(`Speech error: ${event.error}`)
      setIsSpeaking(false)
      setIsPaused(false)
    }

    utterance.onpause = () => {
      setIsSpeaking(false)
      setIsPaused(true)
    }

    utterance.onresume = () => {
      setIsSpeaking(true)
      setIsPaused(false)
    }

    return utterance
  }, [text, synth, pitch, rate, volume, selectedVoice, onError])

  const speak = React.useCallback(() => {
    if (!synth || !text) return

    synth.cancel()

    const utterance = createUtterance()
    if (!utterance) return

    utteranceRef.current = utterance
    synth.speak(utterance)
  }, [createUtterance, synth, text])

  const pause = React.useCallback(() => {
    if (synth?.speaking && utteranceRef.current) {
      synth.pause()
      setIsSpeaking(false)
      setIsPaused(true)
    }
  }, [synth])

  const resume = React.useCallback(() => {
    if (synth?.paused && utteranceRef.current) {
      synth.resume()
      setIsSpeaking(true)
      setIsPaused(false)
    }
  }, [synth])

  const cancel = React.useCallback(() => {
    synth?.cancel()
    setIsSpeaking(false)
    setIsPaused(false)
  }, [synth])

  const setVoice = React.useCallback(
    (name: string) => {
      const voice = voices.find((v) => v.name === name)
      setSelectedVoice(voice || null)
    },
    [voices]
  )

  React.useEffect(() => {
    if (utteranceRef.current && selectedVoice) {
      utteranceRef.current.voice = selectedVoice
    }
  }, [selectedVoice])

  return {
    speak,
    pause,
    resume,
    cancel,
    setVoice,
    isSpeaking,
    isPaused,
    voices: voices.map((v) => v.name),
    isSupported: !!synth,
  }
}
