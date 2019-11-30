export function* lines(input: string) {
  for (const line of input.trim().split(/\n+/)) {
    yield line.trim();
  }
}
