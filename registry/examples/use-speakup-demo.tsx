"use client"

import * as React from "react"
import { useTextToVoice, useVoiceToText } from "registry/hooks/use-speakup"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
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
    setVoice,
    voices,
    isSpeaking,
    ref,
    isSupported: isTextToVoiceSupported,
  } = useTextToVoice<HTMLDivElement>()

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <h1 className="text-3xl font-bold">Speech App</h1>

      {/* Voice-to-Text Section */}
      <div className="border p-6 rounded-lg w-full">
        <h2 className="text-xl font-semibold mb-4">Voice to Text</h2>
        {!isVoiceToTextSupported ? (
          <p className="text-red-500">
            Voice-to-Text is not supported in your browser.
          </p>
        ) : (
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
                disabled={transcript.length === 0 || !isListening}
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
        )}
      </div>

      {/* Text-to-Voice Section */}
      <div className="border p-6 rounded-lg w-full">
        <h2 className="text-xl font-semibold mb-4">Text to Voice</h2>
        {!isTextToVoiceSupported ? (
          <p className="text-red-500">
            Text-to-Voice is not supported in your browser.
          </p>
        ) : (
          <>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to speak..."
              className="w-full mb-4"
              rows={4}
            />
            <div className="flex space-x-4 mb-4">
              <Button onClick={speak} disabled={!text}>
                Speak
              </Button>
              <Button onClick={pause} disabled={!isSpeaking}>
                Pause
              </Button>
              <Button onClick={resume} disabled={!isSpeaking}>
                Resume
              </Button>
            </div>
            <div className="mb-4 space-y-2">
              <Label>Select Voice:</Label>
              <select
                onChange={(e) => setVoice(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {voices.map((voice, index) => (
                  <option key={index} value={voice}>
                    {voice}
                  </option>
                ))}
              </select>
            </div>
            <p>Status: {isSpeaking ? "Speaking..." : "Not Speaking"}</p>
            <div ref={ref} className="">
              {text}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
