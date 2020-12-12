export function chunk<T>(size: number) {
  return function* chunked(iter: Iterable<T>) {
    let currentChunk: T[] = [];
    for (let value of iter) {
      currentChunk.push(value);
      if (currentChunk.length === size) {
        yield currentChunk;
        currentChunk = [];
      }
    }
    if (currentChunk.length < size) yield currentChunk;
  };
}

export const dchunk = uncurry(chunk);

function uncurry<FirstArgs extends any[], SecondArgs extends any[], ReturnType>(
  cb: (...first: FirstArgs) => (...second: SecondArgs) => ReturnType,
): (...args: [...FirstArgs, ...SecondArgs]) => ReturnType {
  return (...args) => {
    const first: any = args.slice(0, cb.length);
    const second: any = args.slice(cb.length);
    return cb(...first)(...second);
  };
}
