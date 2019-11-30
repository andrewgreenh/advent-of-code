export function* words(input: string) {
  for (const word of input.trim().split(/\s+/g)) yield word;
}
