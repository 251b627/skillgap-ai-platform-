import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for combining Tailwind CSS class names cleanly.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
