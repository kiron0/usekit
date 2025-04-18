"use client"

import { useEffect, useRef, useState, type KeyboardEvent } from "react"
import { generateLoremIpsum } from "@/utils/generate-lorem-ipsum"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { notifyError } from "@/components/toast"
import useAutoScroll from "registry/hooks/use-auto-scroll"

interface Message {
  sender: "user" | "ai"
  text: string
}

export default function UseAutoScrollDemo() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "ai", text: "Welcome to the chat!" },
    { sender: "ai", text: "Feel free to add new messages." },
  ])
  const [input, setInput] = useState("")

  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const sendMessage = () => {
    const trimmedInput = input.trim()
    if (trimmedInput === "") {
      return notifyError({
        description: "Please enter a message before sending.",
      })
    }

    const userMessage: Message = { sender: "user", text: trimmedInput }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    const aiResponse = generateLoremIpsum(80, 120)

    const words = aiResponse.split(" ")
    let currentWordIndex = 0

    const newAiMessageIndex = messages.length + 1
    setMessages((prev) => [...prev, { sender: "ai", text: "" }])

    typingIntervalRef.current = setInterval(() => {
      setMessages((prevMessages) => {
        if (!prevMessages[newAiMessageIndex]) {
          return prevMessages
        }

        const updatedMessages = [...prevMessages]
        const currentAiMessage = updatedMessages[newAiMessageIndex]

        currentAiMessage.text +=
          (currentAiMessage.text ? " " : "") + words[currentWordIndex]

        currentWordIndex++

        if (currentWordIndex >= words.length) {
          if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current)
            typingIntervalRef.current = null
          }
        }

        return updatedMessages
      })
    }, 100)
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current)
      }
    }
  }, [])

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border p-4">
      <h2 className="mb-4 text-center text-2xl font-semibold">
        Chat Interface
      </h2>
      <MessageList messages={messages} />
      <div className="flex space-x-2">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={!!typingIntervalRef.current}
          placeholder="Type your message..."
        />
        <Button
          variant="outline"
          type="button"
          disabled={input.trim() === "" || !!typingIntervalRef.current}
          onClick={sendMessage}
        >
          Send
        </Button>
      </div>
    </div>
  )
}

interface MessageListProps {
  messages: Message[]
}

const MessageList = ({ messages }: MessageListProps) => {
  const listRef = useAutoScroll(true, [messages])

  return (
    <ul
      ref={listRef}
      className="mb-4 h-80 space-y-2 overflow-y-auto rounded-md"
    >
      {messages.map((msg, index) => (
        <MessageItem key={`${index}-${msg.sender}-${msg.text}`} message={msg} />
      ))}
    </ul>
  )
}

interface MessageItemProps {
  message: Message
}

const MessageItem = ({ message }: MessageItemProps) => {
  return (
    <li
      className={cn(
        "break-words rounded-md border px-3 py-2 text-sm",
        message.sender === "user"
          ? "self-end border-sky-400/20 bg-sky-400/10"
          : "border-neutral-400/20 bg-secondary"
      )}
    >
      {message.text}
    </li>
  )
}
