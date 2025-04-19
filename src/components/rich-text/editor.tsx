"use client"

import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

import { EditorToolbar } from "./toolbar/editor-toolbar"

interface EditorProps {
  content: string
  placeholder?: string
  onChange: (value: string) => void
}

export function Editor({
  content,
  placeholder = "Type something...",
  onChange,
}: EditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) return <></>

  return (
    <div className="prose w-full max-w-none overflow-hidden rounded-md border border-input dark:prose-invert">
      <EditorToolbar editor={editor} />
      <div className="editor">
        <EditorContent editor={editor} placeholder={placeholder} />
      </div>
    </div>
  )
}
