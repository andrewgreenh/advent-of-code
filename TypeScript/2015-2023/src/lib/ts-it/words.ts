export function words(input: string) {
  return {
    *[Symbol.iterator]() {
      for (const word of input.trim().split(/\s+/g)) yield word;
    },
  };
}
