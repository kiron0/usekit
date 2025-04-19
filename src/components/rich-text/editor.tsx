"use client"

import Placeholder from "@tiptap/extension-placeholder"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

import { EditorToolbar } from "./toolbar/editor-toolbar"

interface EditorProps {
  content: string
  onChange: (value: string) => void
}

export function Editor({ content, onChange }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Type something...",
        showOnlyWhenEditable: true,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    immediatelyRender: false,
  })

  if (!editor) return <></>

  return (
    <div className="prose w-full max-w-none overflow-hidden rounded-md border border-input dark:prose-invert prose-p:m-1">
      <EditorToolbar editor={editor} />
      <div className="editor">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
