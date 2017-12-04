export function* words(input: string) {
  for (const word of input.split(/\s/g)) yield word;
}
