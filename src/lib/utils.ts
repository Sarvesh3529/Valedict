import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateAvatarColor(uid: string): string {
    if (!uid) return 'hsl(0, 0%, 80%)';
    let hash = 0;
    for (let i = 0; i < uid.length; i++) {
        hash = uid.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash; // Ensure 32bit integer
    }
    const h = Math.abs(hash % 360);
    return `hsl(${h}, 35%, 55%)`;
}
