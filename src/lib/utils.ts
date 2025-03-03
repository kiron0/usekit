import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { getBaseURL } from "./baseUrl"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function absoluteUrl(path: string) {
  return `${await getBaseURL()}${path}`
}
