export function uncurry<
  FirstArgs extends any[],
  SecondArgs extends any[],
  ReturnType
>(
  cb: (...first: FirstArgs) => (...second: SecondArgs) => ReturnType,
): (...args: [...FirstArgs, ...SecondArgs]) => ReturnType {
  return (...args) => {
    const first: any = args.slice(0, cb.length);
    const second: any = args.slice(cb.length);
    return cb(...first)(...second);
  };
}
