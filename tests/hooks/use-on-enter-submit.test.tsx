import * as React from "react"
import { act, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useOnEnterSubmit } from "../../registry/hooks/use-on-enter-submit"

interface InputHarnessProps {
  submit: () => void
  checkValidity?: boolean
  preventDefault?: boolean
}

function InputHarness({
  submit,
  checkValidity = true,
  preventDefault = true,
}: InputHarnessProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  useOnEnterSubmit(inputRef, submit, { checkValidity, preventDefault })

  return React.createElement(
    "form",
    { "data-testid": "form" },
    React.createElement("input", {
      "data-testid": "input",
      ref: inputRef,
    })
  )
}

interface TextareaHarnessProps {
  submit: () => void
}

function TextareaHarness({ submit }: TextareaHarnessProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  useOnEnterSubmit(textareaRef, submit)

  return React.createElement(
    "form",
    null,
    React.createElement("textarea", {
      "data-testid": "textarea",
      ref: textareaRef,
    })
  )
}

describe("useOnEnterSubmit", () => {
  it("submits on plain Enter when the form is valid", () => {
    const submit = vi.fn()
    render(React.createElement(InputHarness, { submit }))

    const input = screen.getByTestId("input")
    const form = screen.getByTestId("form") as HTMLFormElement
    const checkValidity = vi.fn(() => true)
    const reportValidity = vi.fn()

    form.checkValidity = checkValidity
    form.reportValidity = reportValidity

    const event = new KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true,
      cancelable: true,
    })

    act(() => {
      input.dispatchEvent(event)
    })

    expect(checkValidity).toHaveBeenCalledTimes(1)
    expect(reportValidity).not.toHaveBeenCalled()
    expect(submit).toHaveBeenCalledTimes(1)
    expect(event.defaultPrevented).toBe(true)
  })

  it("reports invalid forms and ignores textarea enter presses", () => {
    const invalidSubmit = vi.fn()
    render(React.createElement(InputHarness, { submit: invalidSubmit }))

    const input = screen.getByTestId("input")
    const form = screen.getByTestId("form") as HTMLFormElement
    const checkValidity = vi.fn(() => false)
    const reportValidity = vi.fn()

    form.checkValidity = checkValidity
    form.reportValidity = reportValidity

    act(() => {
      input.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Enter",
          bubbles: true,
          cancelable: true,
        })
      )
    })

    expect(invalidSubmit).not.toHaveBeenCalled()
    expect(reportValidity).toHaveBeenCalledTimes(1)

    const textareaSubmit = vi.fn()
    render(React.createElement(TextareaHarness, { submit: textareaSubmit }))

    act(() => {
      screen.getByTestId("textarea").dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Enter",
          bubbles: true,
          cancelable: true,
        })
      )
    })

    expect(textareaSubmit).not.toHaveBeenCalled()
  })
})
