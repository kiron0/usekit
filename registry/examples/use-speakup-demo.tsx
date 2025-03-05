"use client"

import * as React from "react"
import { useTextToVoice, useVoiceToText } from "registry/hooks/use-speakup"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function UseSpeakupDemo() {
  const [text, setText] = React.useState<string>("")

  const {
    startListening,
    stopListening,
    transcript,
    isListening,
    reset: resetVoiceToText,
    isSupported: isVoiceToTextSupported,
  } = useVoiceToText({ lang: "en-US", continuous: true })

  const {
    speak,
    pause,
    resume,
    cancel,
    voice,
    setVoice,
    voices,
    isSpeaking,
    isPaused,
    isSupported: isTextToVoiceSupported,
  } = useTextToVoice({
    text,
  })

  const handleReset = React.useCallback(() => {
    cancel()
    setVoice(voices[0])
    setText("")
  }, [cancel, setVoice, voices])

  return (
    <div className="flex flex-col items-center justify-center w-full space-y-8">
      <h1 className="text-2xl md:text-3xl font-bold">Speech App</h1>

      {/* Voice-to-Text Section */}
      <div className="border p-4 rounded-lg w-full">
        <h2 className="text-lg md:text-xl font-semibold mb-4">Voice to Text</h2>
        {isVoiceToTextSupported ? (
          <>
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                onClick={startListening}
                disabled={isListening || transcript.length > 0}
              >
                Start Listening
              </Button>
              <Button
                onClick={stopListening}
                disabled={transcript.length === 0}
              >
                Stop Listening
              </Button>
              <Button
                onClick={resetVoiceToText}
                disabled={transcript.length === 0}
              >
                Reset
              </Button>
            </div>
            <p>
              Transcript:{" "}
              {transcript || (
                <span className="text-red-500">No transcript available</span>
              )}
            </p>
          </>
        ) : (
          <p className="text-red-500">
            Voice-to-Text is not supported in your browser.
          </p>
        )}
      </div>

      {/* Text-to-Voice Section */}
      <div className="border p-4 rounded-lg w-full">
        <h2 className="text-lg md:text-xl font-semibold mb-4">Text to Voice</h2>
        {isTextToVoiceSupported ? (
          <>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to speak..."
              className="w-full mb-4"
              rows={4}
            />
            <div className="flex flex-wrap gap-2 mb-4">
              <Button onClick={speak} disabled={!text || isSpeaking}>
                Speak
              </Button>
              <Button onClick={pause} disabled={!isSpeaking}>
                Pause
              </Button>
              <Button onClick={resume} disabled={!text || !isPaused}>
                Resume
              </Button>
              <Button onClick={handleReset} disabled={!text}>
                Reset
              </Button>
            </div>
            <div className="mb-4 space-y-2">
              <Label>Select Voice:</Label>
              <Select
                onValueChange={(value) => setVoice(value)}
                defaultValue={voices[0]}
                value={voice}
                disabled={isSpeaking || isPaused}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Voice" />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((voice, index) => (
                    <SelectItem key={index} value={voice}>
                      {voice}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p>Status: {isSpeaking ? "Speaking..." : "Not Speaking"}</p>
          </>
        ) : (
          <p className="text-red-500">
            Text-to-Voice is not supported in your browser.
          </p>
        )}
      </div>
    </div>
  )
}
