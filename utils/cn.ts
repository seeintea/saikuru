import { twMerge } from "tailwind-merge";

export function cn(...inputs: (string | undefined | null | false)[]) {
  // 过滤掉 falsy 值，然后合并
  const validClassNames = inputs.filter(Boolean).join(" ");
  return twMerge(validClassNames);
}
