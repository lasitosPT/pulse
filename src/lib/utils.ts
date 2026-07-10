import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge class names conditionally and resolve conflicting Tailwind utilities
 * so the last-declared utility wins (e.g. `cn('px-2', 'px-4')` → `'px-4'`).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
