export function* seqOf<T>(callback: (index: number) => T) {
  let i = 0;
  while (true) yield callback(i++);
}
