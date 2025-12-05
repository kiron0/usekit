"use client"

import * as React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMaskedInput } from "registry/hooks/use-masked-input"

export default function UseMaskedInputDemo() {
  const phoneRef = React.useRef<HTMLInputElement>(null!)
  const ibanRef = React.useRef<HTMLInputElement>(null!)
  const [phoneRawValue, setPhoneRawValue] = React.useState("")
  const [phoneCompleted, setPhoneCompleted] = React.useState(false)
  const [ibanRawValue, setIbanRawValue] = React.useState("")
  const [ibanCompleted, setIbanCompleted] = React.useState(false)

  useMaskedInput(phoneRef, "+99 (999) 999-9999", {
    onAccept: (value) => {
      setPhoneRawValue(value)
      setPhoneCompleted(false)
    },
    onComplete: (value) => {
      setPhoneRawValue(value)
      setPhoneCompleted(true)
    },
  })

  useMaskedInput(ibanRef, "AA99 XXXX XXXX XXXX XXXX XX", {
    onAccept: (value) => {
      setIbanRawValue(value)
      setIbanCompleted(false)
    },
    onComplete: (value) => {
      setIbanRawValue(value)
      setIbanCompleted(true)
    },
  })

  return (
    <div className="w-full space-y-6">
      <div className="w-full space-y-2">
        <Label htmlFor="phone">International phone</Label>
        <Input
          id="phone"
          ref={phoneRef}
          defaultValue="125551234567"
          placeholder="+12 (555) 123-4567"
          inputMode="tel"
        />
        <p className="text-sm text-muted-foreground">
          Raw value: {phoneRawValue || "—"} {phoneCompleted ? "(complete)" : ""}
        </p>
      </div>

      <div className="w-full space-y-2">
        <Label htmlFor="iban">IBAN</Label>
        <Input
          id="iban"
          ref={ibanRef}
          defaultValue="DE89370400440532013000"
          placeholder="DE89 3704 0044 0532 0130 00"
          inputMode="text"
        />
        <p className="text-sm text-muted-foreground">
          Raw value: {ibanRawValue || "—"} {ibanCompleted ? "(complete)" : ""}
        </p>
      </div>
    </div>
  )
}
