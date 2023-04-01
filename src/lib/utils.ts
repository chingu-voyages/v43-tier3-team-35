import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getNameLetters(name: string): string {
    const words = name.split(" ")
    switch (words.length) {
      case 0:
        return "AN"
      case 1:
        return words?.[0]?.[0] ?? "AN"
      default:
        const firstLetter = words?.[0]?.[0] ?? "A"
        const secondLetter = words?.[1]?.[0] ?? "N"
        return firstLetter + secondLetter;

    }
}