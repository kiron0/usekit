"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { notifySuccess } from "@/components/toast"
import { useEncryption } from "registry/hooks/use-encryption"

type CryptoOperation = "encrypt" | "decrypt"

interface CryptoBoxProps {
  operation: CryptoOperation
  defaultInput?: string
  defaultSecret?: string
  className?: string
}

export function CryptoBox({
  operation,
  defaultInput = "",
  defaultSecret = "",
  className = "",
}: CryptoBoxProps) {
  const { encrypt, decrypt } = useEncryption()

  const [config, setConfig] = React.useState({
    input: defaultInput,
    secret: defaultSecret,
    result: "",
    error: "",
  })

  const updateConfig = (configData: Partial<typeof config>) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      ...configData,
    }))
  }

  const handleOperation = () => {
    updateConfig({ error: "", result: "" })

    let result: string | false
    if (operation === "encrypt") {
      result = encrypt(config.input, config.secret)
    } else {
      result = decrypt<string>(config.input, config.secret)
    }

    if (result) {
      updateConfig({ result })
    } else {
      updateConfig({
        error: `${operation === "encrypt" ? "Encryption" : "Decryption"} failed`,
      })
    }
  }

  const handleCopy = () => {
    if (config.result) {
      navigator.clipboard.writeText(config.result)
      notifySuccess({
        title: "Copied to clipboard",
        description: "The result has been copied to your clipboard.",
      })
    }
  }

  const opTitle = `${operation === "encrypt" ? "Encryption" : "Decryption"} Example`
  const opInputLabel = operation === "encrypt" ? "Input Data" : "Encrypted Data"
  const opResultLabel =
    operation === "encrypt" ? "Encrypted Data" : "Decrypted Data"
  const buttonText = operation === "encrypt" ? "Encrypt" : "Decrypt"

  return (
    <div className={cn("rounded-xl border p-5", className)}>
      <h3 className="mb-2 font-semibold">{opTitle}</h3>
      <div className="mb-4 space-y-2">
        <Label>{opInputLabel}</Label>
        <Input
          type="text"
          value={config.input}
          onChange={(e) => updateConfig({ input: e.target.value })}
          placeholder={`Enter data to ${operation}`}
        />
      </div>
      <div className="mb-4 space-y-2">
        <Label>Secret Key</Label>
        <Input
          type="text"
          value={config.secret}
          onChange={(e) => updateConfig({ secret: e.target.value })}
          placeholder="Enter secret key"
        />
      </div>
      <Button
        onClick={handleOperation}
        disabled={!config.input || !config.secret}
        className="mb-4 w-full"
      >
        {buttonText}
      </Button>
      {config.error && <p className="mb-4 text-destructive">{config.error}</p>}
      {config.result && (
        <div className="flex flex-col space-y-2">
          <Label>{opResultLabel}</Label>
          <code
            className="w-fit cursor-pointer select-none rounded-md bg-muted px-2 py-1 font-mono text-sm"
            onClick={handleCopy}
            title="Click to copy"
          >
            {config.result}
          </code>
        </div>
      )}
    </div>
  )
}

export default function UseEncryptionDemo() {
  return (
    <div className="w-full space-y-8">
      <CryptoBox operation="encrypt" />
      <CryptoBox operation="decrypt" />
    </div>
  )
}
