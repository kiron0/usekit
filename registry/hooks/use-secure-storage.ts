"use client"

import * as React from "react"
import CryptoJS from "crypto-js"

type SetStateAction<T> = T | ((prevState: T) => T)
type StorageType = "localStorage" | "sessionStorage"

export interface UseSecureStorageOptions {
  storageType?: StorageType
  ttl?: number
  rotateKeyFn?: () => Promise<string> | string
  serverKeyEndpoint?: string
  encryptionKey?: string
}

interface EncryptedValue {
  data: string
  expiresAt?: number
}

const DEFAULT_STORAGE_TYPE: StorageType = "localStorage"
const KEY_VERSION_PREFIX = "__key_version__"
const DEFAULT_KEY_VERSION = 1

function getStorage(storageType: StorageType): Storage | null {
  if (typeof window === "undefined") return null
  return storageType === "localStorage"
    ? window.localStorage
    : window.sessionStorage
}

function encryptValue<T>(value: T, key: string): string {
  try {
    return CryptoJS.AES.encrypt(JSON.stringify(value), key).toString()
  } catch (error) {
    console.error("Encryption error:", error)
    throw new Error("Failed to encrypt value")
  }
}

function decryptValue<T>(encrypted: string, key: string): T {
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, key)
    const decrypted = bytes.toString(CryptoJS.enc.Utf8)
    if (!decrypted) {
      throw new Error("Decryption failed: empty result")
    }
    return JSON.parse(decrypted) as T
  } catch (error) {
    console.error("Decryption error:", error)
    throw new Error("Failed to decrypt value")
  }
}

function getKeyVersionKey(storageKey: string): string {
  return `${KEY_VERSION_PREFIX}${storageKey}`
}

function getLocalEncryptionKey(
  storageKey: string,
  storageType: StorageType
): string | null {
  const storage = getStorage(storageType)
  if (!storage) return null

  const keyVersionKey = getKeyVersionKey(storageKey)
  const storedKeyVersion = storage.getItem(keyVersionKey)
  const keyVersion = storedKeyVersion
    ? parseInt(storedKeyVersion, 10)
    : DEFAULT_KEY_VERSION

  const keyVersionStorageKey = `${storageKey}_key_${keyVersion}`
  return storage.getItem(keyVersionStorageKey)
}

function getOrCreateLocalEncryptionKey(
  storageKey: string,
  storageType: StorageType
): string {
  const storage = getStorage(storageType)
  if (!storage) {
    throw new Error("Storage not available")
  }

  const keyVersionKey = getKeyVersionKey(storageKey)
  const storedKeyVersion = storage.getItem(keyVersionKey)
  const keyVersion = storedKeyVersion
    ? parseInt(storedKeyVersion, 10)
    : DEFAULT_KEY_VERSION

  const keyVersionStorageKey = `${storageKey}_key_${keyVersion}`
  let key = storage.getItem(keyVersionStorageKey)

  if (!key) {
    key = CryptoJS.lib.WordArray.random(256 / 8).toString()
    storage.setItem(keyVersionStorageKey, key)
  }

  return key
}

async function getEncryptionKey(
  storageKey: string,
  options: UseSecureStorageOptions
): Promise<string> {
  const {
    encryptionKey,
    rotateKeyFn,
    serverKeyEndpoint,
    storageType = DEFAULT_STORAGE_TYPE,
  } = options

  if (encryptionKey) {
    return encryptionKey
  }

  if (serverKeyEndpoint) {
    try {
      const response = await fetch(serverKeyEndpoint)
      if (response.ok) {
        const data = await response.json()
        const serverKey = data.key || data.encryptionKey
        if (serverKey) return serverKey
      }
    } catch (error) {
      console.warn("Failed to fetch server key, using local key:", error)
    }
  }

  if (rotateKeyFn) {
    try {
      const key = await Promise.resolve(rotateKeyFn())
      if (key) return key
    } catch (error) {
      console.warn("Key rotation function failed, using local key:", error)
    }
  }

  return getOrCreateLocalEncryptionKey(storageKey, storageType)
}

function isExpired(expiresAt?: number): boolean {
  if (!expiresAt) return false
  return Date.now() > expiresAt
}

export interface UseSecureStorageReturn<T> {
  value: T
  setValue: (value: SetStateAction<T>) => void
  remove: () => void
}

export function useSecureStorage<T>(
  name: string,
  initialValue: T | (() => T),
  options: UseSecureStorageOptions = {}
): UseSecureStorageReturn<T> {
  const { storageType = DEFAULT_STORAGE_TYPE, ttl, encryptionKey } = options

  const [value, setValue] = React.useState<T>(() => {
    if (typeof window === "undefined") {
      return typeof initialValue === "function"
        ? (initialValue as () => T)()
        : initialValue
    }

    const storage = getStorage(storageType)
    if (!storage) {
      return typeof initialValue === "function"
        ? (initialValue as () => T)()
        : initialValue
    }

    try {
      const encrypted = storage.getItem(name)
      if (!encrypted) {
        return typeof initialValue === "function"
          ? (initialValue as () => T)()
          : initialValue
      }

      const parsed: EncryptedValue = JSON.parse(encrypted)

      if (parsed.expiresAt && isExpired(parsed.expiresAt)) {
        storage.removeItem(name)
        return typeof initialValue === "function"
          ? (initialValue as () => T)()
          : initialValue
      }

      const key = encryptionKey || getLocalEncryptionKey(name, storageType)
      if (key) {
        try {
          return decryptValue<T>(parsed.data, key)
        } catch (error) {
          console.error(`Failed to decrypt value for key "${name}":`, error)
        }
      }

      return typeof initialValue === "function"
        ? (initialValue as () => T)()
        : initialValue
    } catch (error) {
      console.error(`Error reading secure storage key "${name}":`, error)
      return typeof initialValue === "function"
        ? (initialValue as () => T)()
        : initialValue
    }
  })

  const setSecureValue = React.useCallback(
    async (newValue: SetStateAction<T>) => {
      try {
        const valueToStore =
          newValue instanceof Function ? newValue(value) : newValue

        const key = await getEncryptionKey(name, options)
        if (!key) {
          throw new Error("Encryption key not available")
        }

        const encrypted = encryptValue(valueToStore, key)
        const expiresAt = ttl ? Date.now() + ttl : undefined

        const encryptedValue: EncryptedValue = {
          data: encrypted,
          expiresAt,
        }

        const storage = getStorage(storageType)
        if (!storage) return

        storage.setItem(name, JSON.stringify(encryptedValue))
        setValue(valueToStore)
      } catch (error) {
        console.error(`Error setting secure storage key "${name}":`, error)
      }
    },
    [name, storageType, ttl, value, options]
  )

  const removeValue = React.useCallback(() => {
    const storage = getStorage(storageType)
    if (storage) {
      storage.removeItem(name)
      const keyVersionKey = getKeyVersionKey(name)
      storage.removeItem(keyVersionKey)
    }
    setValue(
      typeof initialValue === "function"
        ? (initialValue as () => T)()
        : initialValue
    )
  }, [name, storageType, initialValue])

  const handleStorageChange = React.useCallback(
    async (event: StorageEvent) => {
      if (event.key === name && event.storageArea === getStorage(storageType)) {
        try {
          if (!event.newValue) {
            setValue(
              typeof initialValue === "function"
                ? (initialValue as () => T)()
                : initialValue
            )
            return
          }

          const parsed: EncryptedValue = JSON.parse(event.newValue)

          if (parsed.expiresAt && isExpired(parsed.expiresAt)) {
            removeValue()
            return
          }

          const key = await getEncryptionKey(name, options)
          if (key) {
            const decrypted = decryptValue<T>(parsed.data, key)
            setValue(decrypted)
          }
        } catch (error) {
          console.error(
            `Error parsing new secure storage value for key "${name}":`,
            error
          )
        }
      }
    },
    [name, storageType, initialValue, options, removeValue]
  )

  React.useEffect(() => {
    if (typeof window === "undefined") return
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [handleStorageChange])

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const storage = getStorage(storageType)
    if (!storage) return

    const checkExpiration = () => {
      try {
        const encrypted = storage.getItem(name)
        if (!encrypted) return

        const parsed: EncryptedValue = JSON.parse(encrypted)
        if (parsed.expiresAt && isExpired(parsed.expiresAt)) {
          removeValue()
        }
      } catch {}
    }

    const intervalId = setInterval(checkExpiration, 1000)
    return () => clearInterval(intervalId)
  }, [name, storageType, removeValue])

  return {
    value,
    setValue: setSecureValue,
    remove: removeValue,
  }
}
