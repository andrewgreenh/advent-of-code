import 'lodash';

const defaultMaxDepth = 5000;

export type ParserResult<TResult> = [TResult, string];
export type Parser<TResult> = (
  input: string,
  maxDepth?: number,
) => Iterable<ParserResult<TResult>>;
export type ExtractParserResult<TParser> = TParser extends Parser<infer Result>
  ? Result
  : never;

const startsWith = <TString extends string>(
  expected: TString,
): Parser<TString> =>
  renameFunc(
    `startsWith ${expected}`,
    function* startsWithParser(input: string) {
      if (input.startsWith(expected)) {
        yield [expected, input.slice(expected.length)];
      }
    },
  );

const seqOf = <TParsers extends Parser<any>[]>(
  ...parsers: TParsers
): Parser<{ [key in keyof TParsers]: ExtractParserResult<TParsers[key]> }> =>
  renameFunc(
    `seq (${parsers.map((p) => p.name).join(', ')})`,
    function* seqParser(input, maxDepth = defaultMaxDepth) {
      if (maxDepth === 0) return;
      const [first, ...rest] = parsers;
      if (parsers.length === 1) return yield* first(input, maxDepth - 1);

      for (const result of first(input, maxDepth - 1)) {
        for (const restResult of seqOf(...rest)(result[1], maxDepth - 1)) {
          yield [[result[0], ...restResult[0]], restResult[1]];
        }
      }
    },
  );

const oneOf = <TParsers extends Parser<any>[]>(
  ...parsers: TParsers
): Parser<
  {
    [key in keyof TParsers & number]: ExtractParserResult<TParsers[key]>;
  }[keyof TParsers & number]
> =>
  renameFunc(
    `oneOf (${parsers.map((p) => p.name).join(', ')})`,
    function* orParser(input, maxDepth = defaultMaxDepth) {
      if (maxDepth === 0) return;
      for (const parser of parsers) {
        for (const result of parser(input, maxDepth - 1)) {
          yield result;
        }
      }
    },
  );

const lazy = <TParser extends Parser<any>>(
  parserFactory: () => TParser,
): TParser => {
  function lazyParser(input, maxDepth = defaultMaxDepth) {
    if (maxDepth === 0) return [];
    const parser = parserFactory();
    renameFunc(`lazy ${parser.name}`, lazyParser);
    return parser(input, maxDepth - 1);
  }
  return lazyParser as TParser;
};

const transform = <TInput, TOutput>(
  parser: Parser<TInput>,
  transform: (result: TInput) => TOutput,
): Parser<TOutput> =>
  renameFunc(
    `Transformed ${parser.name}`,
    function* (input, maxDepth = defaultMaxDepth) {
      if (maxDepth === 0) return;
      for (const result of parser(input))
        yield [transform(result[0]), result[1]];
    },
  );

function parse<TResult>(
  parser: Parser<TResult>,
  input: string,
  maxDepth = defaultMaxDepth,
): TResult | 'FAILURE' {
  for (const result of parser(input, maxDepth)) {
    if (result[1].length === 0) return result[0];
  }
  return 'FAILURE';
}

export const parsel = {
  startsWith,
  oneOf,
  seqOf,
  lazy,
  parse,
  transform,
};

function renameFunc<TFunc extends (...args: any[]) => any>(
  newName: string,
  func: TFunc,
): TFunc {
  Object.defineProperty(func, 'name', { value: newName });
  return func;
}
