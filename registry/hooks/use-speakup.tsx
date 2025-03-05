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
  chunkSize?: number
  onError?: (error: string) => void
}

export const useTextToVoice = ({
  text = "",
  pitch = 1,
  rate = 1,
  volume = 1,
  chunkSize = 200,
  onError,
}: TextToVoiceOptions = {}) => {
  const [isSpeaking, setIsSpeaking] = React.useState(false)
  const [isPaused, setIsPaused] = React.useState(false)
  const [voices, setVoices] = React.useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] =
    React.useState<SpeechSynthesisVoice | null>(null)
  const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null)

  const pitchRef = React.useRef(pitch)
  const rateRef = React.useRef(rate)
  const volumeRef = React.useRef(volume)
  const selectedVoiceRef = React.useRef(selectedVoice)
  const chunksRef = React.useRef<string[]>([])
  const currentChunkIndexRef = React.useRef(0)

  const synth = React.useMemo(() => {
    if (typeof window === "undefined") return null
    return window.speechSynthesis
  }, [])

  // Update refs when dependencies change
  React.useEffect(() => {
    pitchRef.current = pitch
  }, [pitch])
  React.useEffect(() => {
    rateRef.current = rate
  }, [rate])
  React.useEffect(() => {
    volumeRef.current = volume
  }, [volume])
  React.useEffect(() => {
    selectedVoiceRef.current = selectedVoice
  }, [selectedVoice])

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

  const createUtterance = React.useCallback(
    (chunkText: string) => {
      if (!synth) return null

      const utterance = new SpeechSynthesisUtterance(chunkText)
      utterance.pitch = pitchRef.current
      utterance.rate = rateRef.current
      utterance.volume = volumeRef.current
      utterance.voice = selectedVoiceRef.current

      utterance.onstart = () => {
        setIsSpeaking(true)
        setIsPaused(false)
      }

      utterance.onend = () => {
        const nextIndex = currentChunkIndexRef.current + 1
        if (nextIndex < chunksRef.current.length) {
          currentChunkIndexRef.current = nextIndex
          const nextChunk = chunksRef.current[nextIndex]
          const nextUtterance = createUtterance(nextChunk)
          if (nextUtterance) {
            utteranceRef.current = nextUtterance
            synth.speak(nextUtterance)
          }
        } else {
          setIsSpeaking(false)
          setIsPaused(false)
        }
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
    },
    [synth, onError]
  )

  const speak = React.useCallback(() => {
    if (!synth || !text) return

    synth.cancel()
    const chunks = text.match(new RegExp(`.{1,${chunkSize}}`, "g")) || []
    chunksRef.current = chunks
    currentChunkIndexRef.current = 0

    if (chunks.length === 0) return

    const utterance = createUtterance(chunks[0] || "")
    if (!utterance) return

    utteranceRef.current = utterance
    synth.speak(utterance)
  }, [text, synth, createUtterance, chunkSize])

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

  return {
    speak,
    pause,
    resume,
    cancel,
    voice: selectedVoice?.name,
    setVoice,
    isSpeaking,
    isPaused,
    voices: voices.map((v) => v.name),
    isSupported: !!synth,
  }
}
