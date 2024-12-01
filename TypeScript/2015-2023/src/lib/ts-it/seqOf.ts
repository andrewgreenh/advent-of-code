export function seqOf<T>(callback: (index: number) => T) {
  return {
    *[Symbol.iterator]() {
      let i = 0;
      while (true) yield callback(i++);
    },
  };
}
