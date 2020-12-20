import 'lodash';

const defaultMaxDepth = 5000;

type Uniq<TName extends string> = { readonly _brand: unique symbol };

function uniq<TName extends string>(name: TName): Uniq<TName> {
  return { _brand: 'skip-token' } as any;
}

const SkipToken = uniq('skip token');
type SkipToken = typeof SkipToken;

type HandleSkipToken<T extends any[]> = T extends []
  ? T
  : T extends [infer Head, ...infer Tail]
  ? SkipToken extends Head
    ? Head extends SkipToken
      ? HandleSkipToken<Tail>
      :
          | [Exclude<Head, SkipToken>, ...HandleSkipToken<Tail>]
          | HandleSkipToken<Tail>
    : [Head, ...HandleSkipToken<Tail>]
  : T;

export type ParserResult<TResult> = [TResult, string];
export type Parser<TResult> = (
  input: string,
  maxDepth?: number,
) => Iterable<ParserResult<TResult>>;
export type ExtractParserResult<TParser> = TParser extends Parser<infer Result>
  ? Result
  : never;

const digit: Parser<number> = renameFunc(
  `digit`,
  function* digitParser(input: string) {
    if (input[0].match(/\d/)) yield [+input[0], input.slice(1)];
  },
);

const optional = <TResult>(
  parser: Parser<TResult>,
): Parser<TResult | SkipToken> =>
  renameFunc(
    `optional ${parser.name}`,
    function* optionalParser(input, maxDepth = defaultMaxDepth) {
      if (maxDepth === 0) return;
      let hadOne = false;
      for (const result of parser(input, maxDepth - 1)) {
        hadOne = true;
        yield result;
      }
      if (!hadOne) yield [SkipToken, input];
    },
  );

const zeroOrMore = <TResult>(parser: Parser<TResult>): Parser<TResult[]> =>
  renameFunc(
    `zeroOrMore ${parser.name}`,
    transform(
      optional(
        transform(
          seqOf(
            parser,
            lazy(() => zeroOrMore(parser)),
          ),
          flattenResultTransform,
        ),
      ),
      (x) => (x === SkipToken ? [] : x),
    ) as any,
  );

const flattenResultTransform = (x: any) => (x[1] ? [x[0], ...x[1]] : x);

const onceOrMore = <TResult>(parser: Parser<TResult>): Parser<TResult[]> =>
  renameFunc(
    `onceOrMore ${parser.name}`,
    transform(
      seqOf(
        parser,
        lazy(() => zeroOrMore(parser)),
      ),
      flattenResultTransform,
    ) as any,
  );

const skip = (parser: Parser<any>): Parser<SkipToken> =>
  renameFunc(
    `skip ${parser.name}`,
    function* skipParser(input, maxDepth = defaultMaxDepth) {
      if (maxDepth === 0) return;
      for (const result of parser(input)) {
        yield [SkipToken, result[1]];
      }
    },
  );

const separatedBy = (separationParser: Parser<any>) => <TResult>(
  tokenParser: Parser<TResult>,
): Parser<TResult[]> =>
  renameFunc(
    `${tokenParser.name} separated by ${separationParser.name}`,
    transform(
      seqOf(
        tokenParser,
        transform(zeroOrMore(seqOf(skip(separationParser), tokenParser)), (x) =>
          x.flat(1),
        ),
      ),
      flattenResultTransform,
    ) as any,
  );

const number: Parser<number> = renameFunc(
  `number`,
  function* numberParser(input: string) {},
);

const string = <TString extends string>(expected: TString): Parser<TString> =>
  renameFunc(
    `startsWith ${expected}`,
    function* startsWithParser(input: string) {
      if (input.startsWith(expected)) {
        yield [expected, input.slice(expected.length)];
      }
    },
  );

const pattern = (pattern: string): Parser<string> => {
  const regex = new RegExp(`^(${pattern})`);
  return renameFunc(
    `pattern: ${pattern}`,
    function* patternParser(input: string) {
      const match = input.match(regex);
      if (match) yield [match[1], input.slice(match[1].length)];
    },
  );
};

const whitespace = pattern('\n|\t| ');

const spaceSeparated = separatedBy(whitespace);
const commaSeparated = separatedBy(string(','));

const seqOf = <TParsers extends Parser<any>[]>(
  ...parsers: TParsers
): Parser<
  HandleSkipToken<
    {
      [key in keyof TParsers]: ExtractParserResult<TParsers[key]>;
    }
  >
> =>
  renameFunc(
    `seq (${parsers.map((p) => p.name).join(', ')})`,
    function* seqParser(input, maxDepth = defaultMaxDepth) {
      if (maxDepth === 0) return;
      const [first, ...rest] = parsers;
      if (parsers.length === 1) {
        for (const result of first(input, maxDepth - 1)) {
          yield [[result[0]].filter((x) => x !== SkipToken), result[1]] as any;
        }
        return;
      }

      for (const result of first(input, maxDepth - 1)) {
        for (const restResult of seqOf(...rest)(result[1], maxDepth - 1)) {
          yield [
            [result[0], ...restResult[0]].filter((x) => x !== SkipToken),
            restResult[1],
          ];
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
  digit,
  lazy,
  number,
  onceOrMore,
  oneOf,
  optional,
  parse,
  seqOf,
  string,
  transform,
  zeroOrMore,
  skip,
  pattern,
  whitespace,
  commaSeparated,
  spaceSeparated,
  separatedBy,
};

function renameFunc<TFunc extends (...args: any[]) => any>(
  newName: string,
  func: TFunc,
): TFunc {
  Object.defineProperty(func, 'name', { value: newName });
  return func;
}
