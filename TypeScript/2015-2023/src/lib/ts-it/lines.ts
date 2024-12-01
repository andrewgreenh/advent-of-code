export function stringToLines(input: string) {
  return input
    .trim()
    .split(/\n+/)
    .map((line) => line.trim());
}
