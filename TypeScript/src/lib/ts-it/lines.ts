export function* lines(input: string) {
  for (const line of input.split('\n')) {
    yield line.trim();
  }
}
