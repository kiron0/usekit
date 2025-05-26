import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function useClassName(...inputs: ClassValue[]) {
  return React.useMemo(() => {
    return twMerge(clsx(inputs))
  }, [inputs])
}
