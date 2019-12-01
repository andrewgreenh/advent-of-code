export function lines(input: string) {
  return {
    *[Symbol.iterator]() {
      for (const line of input.trim().split(/\n+/)) {
        yield line.trim();
      }
    },
  };
}
