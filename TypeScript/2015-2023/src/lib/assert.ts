export function assert(
  condition: boolean,
  message?: string,
): asserts condition {
  if (!condition) {
    throw new Error(message ?? 'Unexpected falsy condition');
  }
}
