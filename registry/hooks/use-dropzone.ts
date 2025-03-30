import * as React from "react"

import { useEventListener } from "./use-event-listener"

type DataTypesValidator = string[] | ((types: readonly string[]) => boolean)

interface UseDropZoneOptions {
  dataTypes?: DataTypesValidator
  onDrop?: (files: File[] | null, event: DragEvent) => void
  onEnter?: (files: File[] | null, event: DragEvent) => void
  onLeave?: (files: File[] | null, event: DragEvent) => void
  onOver?: (files: File[] | null, event: DragEvent) => void
  multiple?: boolean
  preventDefaultForUnhandled?: boolean
}

interface UseDropZoneReturn {
  files: File[] | null
  clearFiles: () => void
  isOverDropZone: boolean
}

const safariRegex = /^(?:(?!chrome|android).)*safari/i

export function useDropZone(
  target: React.RefObject<HTMLElement | null>,
  options: UseDropZoneOptions | UseDropZoneOptions["onDrop"] = {}
): UseDropZoneReturn {
  const [isOverDropZone, setIsOverDropZone] = React.useState(false)
  const [files, setFiles] = React.useState<File[] | null>(null)

  const counterRef = React.useRef(0)
  const isValidRef = React.useRef(true)

  const _options = typeof options === "function" ? { onDrop: options } : options
  const multiple = _options.multiple ?? true
  const preventDefaultForUnhandled =
    _options.preventDefaultForUnhandled ?? false

  const getFiles = (event: DragEvent): File[] | null => {
    const fileList = event.dataTransfer?.files
    if (!fileList || fileList.length === 0) return null
    const filesArray = Array.from(fileList)
    return multiple ? filesArray : [filesArray[0]]
  }

  const checkDataTypes = (types: string[]): boolean => {
    const { dataTypes } = _options

    if (typeof dataTypes === "function") {
      return dataTypes(types)
    }

    if (!dataTypes || dataTypes.length === 0) {
      return true
    }

    if (types.length === 0) {
      return false
    }

    return types.every((type) =>
      dataTypes.some((allowedType) => type.includes(allowedType))
    )
  }

  const checkValidity = (items: DataTransferItemList | null): boolean => {
    if (!items) return false
    const types = Array.from(items).map((item) => item.type)
    const dataTypesValid = checkDataTypes(types)
    const multipleFilesValid = multiple || items.length <= 1
    return dataTypesValid && multipleFilesValid
  }

  const isSafari = (): boolean => safariRegex.test(navigator.userAgent)

  const handleDragEvent = (
    event: DragEvent,
    eventType: "enter" | "over" | "leave" | "drop"
  ): void => {
    const dataTransferItems = event.dataTransfer?.items
    isValidRef.current = dataTransferItems
      ? checkValidity(dataTransferItems)
      : false

    if (preventDefaultForUnhandled || isValidRef.current) {
      event.preventDefault()
    }

    if (!(isSafari() || isValidRef.current)) {
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "none"
      }
      return
    }

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "copy"
    }

    const currentFiles = getFiles(event)

    switch (eventType) {
      case "enter": {
        counterRef.current += 1
        setIsOverDropZone(true)
        _options.onEnter?.(currentFiles, event)
        break
      }
      case "over": {
        _options.onOver?.(currentFiles, event)
        break
      }
      case "leave": {
        counterRef.current -= 1
        if (counterRef.current === 0) {
          setIsOverDropZone(false)
        }
        _options.onLeave?.(currentFiles, event)
        break
      }
      case "drop": {
        counterRef.current = 0
        setIsOverDropZone(false)
        if (isValidRef.current) {
          setFiles(currentFiles)
          _options.onDrop?.(currentFiles, event)
        }
        break
      }
      default:
        break
    }
  }

  const clearFiles = React.useCallback(() => {
    setFiles(null)
  }, [])

  useEventListener("dragenter", (e) => handleDragEvent(e, "enter"), target)
  useEventListener("dragover", (e) => handleDragEvent(e, "over"), target)
  useEventListener("dragleave", (e) => handleDragEvent(e, "leave"), target)
  useEventListener("drop", (e) => handleDragEvent(e, "drop"), target)

  return { files, clearFiles, isOverDropZone }
}
