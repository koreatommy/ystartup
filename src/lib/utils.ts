import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** `profiles.created_at` 등 ISO 시각을 회원가입일 표기용 로컬 날짜로 변환 */
export function formatProfileJoinedDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ko-KR");
}
