import 'lodash';

type ResultType = unknown;
type ParsingResult = [ResultType[], string] | Failure;
type Failure = 'FAILURE';
const failure = 'FAILURE' as Failure;

interface Parser {
  (input: string): ParsingResult;
}

const parse = (p: Parser) => (input: string): Failure | unknown[] => {
  const result = p(input);
  if (result === failure) return result;
  if (result[1].length > 0) return failure;
  return result[0];
};

const debugParse = (p: Parser) => (input: string) => {
  return p(input);
};

const headTail = (s: string) => [s[0], s.slice(1)];

const char = (c: string): Parser => input => {
  const [head, tail] = headTail(input);
  if (c !== head) return failure;
  return [[c], tail];
};

const string = (s: string): Parser => input => {
  if (input.startsWith(s)) return [[s], input.slice(s.length)];
  return failure;
};

const sequenceOf = (...parsers: Parser[]): Parser => input => {
  let lastResult = [[], input] as ParsingResult;
  for (const parser of parsers) {
    if (lastResult === failure) break;
    const result = parser(lastResult[1]);
    if (result === failure) {
      lastResult = failure;
      break;
    }
    lastResult = [[...lastResult[0], ...result[0]], result[1]];
  }
  return lastResult;
};

const optional = (parser: Parser): Parser => input => {
  const result = parser(input);
  if (result === failure) return [[], input];
  return result;
};

const lazy = (parserFactory: () => Parser): Parser => input => {
  const parser = parserFactory();
  return parser(input);
};

const transform = (p: Parser) => <TTo extends any[]>(
  t: (value: unknown[]) => TTo,
): Parser => input => {
  const result = p(input);
  if (result === failure) return result;
  return [t(result[0]), result[1]];
};

const zeroOrMore = (parser: Parser): Parser =>
  optional(
    sequenceOf(
      parser,
      lazy(() => zeroOrMore(parser)),
    ),
  );

const onceOrMore = (parser: Parser): Parser =>
  sequenceOf(
    parser,
    lazy(() => zeroOrMore(parser)),
  );

const or = (...parsers: Parser[]): Parser => input => {
  for (const parser of parsers) {
    const result = parser(input);
    if (result !== failure) return result;
  }
  return failure;
};

const oneOfString = (string: string): Parser => or(...[...string].map(char));

const allLetters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const letter = oneOfString(allLetters);
const digit = oneOfString('0123456789');
const join = (p: Parser) =>
  transform(p)(t => {
    if (Array.isArray(t)) return [t.join('')];
    return t;
  });
const word = join(onceOrMore(letter));
const number = join(onceOrMore(digit));

const skip = (p: Parser): Parser => input => {
  const result = p(input);
  if (result === failure) return failure;
  return [[], result[1]];
};

const separatedBy = (separationParser: Parser) => (
  tokenParser: Parser,
): Parser =>
  sequenceOf(
    tokenParser,
    zeroOrMore(sequenceOf(skip(separationParser), tokenParser)),
  );

const everythingExcept = (p: Parser): Parser => input => {
  if (input.length === 0) return failure;
  const result = p(input);
  if (result === failure) {
    const [head, tail] = headTail(input);
    return [[head], tail];
  }
  return failure;
};

const between = (startParser: Parser, endParser?: Parser) => (
  middleParser: Parser,
): Parser =>
  sequenceOf(skip(startParser), middleParser, skip(endParser || startParser));
const optionallyBetween = (startParser: Parser, endParser?: Parser) => (
  middleParser: Parser,
): Parser => or(between(startParser, endParser)(middleParser), middleParser);

const everything: Parser = input => {
  if (input.length === 0) return failure;
  const [head, tail] = headTail(input);
  return [[head], tail];
};

const empty: Parser = input => [[], input];

const whitespace = onceOrMore(oneOfString(' \n\r\t'));
const optionalWhitespace = optional(whitespace);
const betweenOptionalWhitespace = between(optionalWhitespace);
const spaceSeparated = separatedBy(whitespace);
const betweenBrackets = between(char('('), char(')'));
const bracketed = (p: Parser): Parser =>
  lazy(() => or(betweenBrackets(bracketed(p)), p));
const commaSeparated = separatedBy(char(','));
const intoArray = (p: Parser) => transform(p)((t: any) => [t]);

const num = betweenOptionalWhitespace(number);
const lowPrioOperator = betweenOptionalWhitespace(oneOfString('+-'));
const highPrioOperator = betweenOptionalWhitespace(oneOfString('*/'));
const highestPrioOperator = betweenOptionalWhitespace(oneOfString('^'));

const toNumber = (result: unknown[]) => {
  return result.map(Number);
};

const toCall = (result: unknown[]) => {
  return [
    {
      type: 'CALL',
      func: result[0],
      args: result.slice(1),
    },
  ];
};

const toOperator = (result: unknown[]) => {
  return [
    {
      type: 'OPERATOR',
      operator: result[1],
      firstOperand: result[0],
      secondOperand: result[2],
    },
  ];
};

const expression = lazy(() =>
  or(
    transform(sequenceOf(term, lowPrioOperator, expression))(toOperator),
    term,
  ),
);
const term = lazy(() =>
  or(
    transform(sequenceOf(exponentiation, highPrioOperator, term))(toOperator),
    exponentiation,
  ),
);
const exponentiation = lazy(() =>
  or(
    transform(sequenceOf(base, highestPrioOperator, exponentiation))(
      toOperator,
    ),
    base,
  ),
);
const base = lazy(() =>
  or(call, transform(num)(toNumber), betweenBrackets(expression)),
);
const call = lazy(() =>
  transform(
    sequenceOf(word, betweenBrackets(separatedBy(char(','))(expression))),
  )(toCall),
);

const funcsByName = {
  sum: (...args: unknown[]) =>
    args.reduce((a: number, b) => a + evaluate(b), 0),
};

const evaluate = (astNode: any): number => {
  if (Array.isArray(astNode)) return evaluate(astNode[0]);
  if (typeof astNode === 'number') return astNode;
  if (typeof astNode === 'object' && astNode.type === 'OPERATOR') {
    switch (astNode.operator) {
      case '*':
        return evaluate(astNode.firstOperand) * evaluate(astNode.secondOperand);
      case '/':
        return evaluate(astNode.firstOperand) / evaluate(astNode.secondOperand);
      case '+':
        return evaluate(astNode.firstOperand) + evaluate(astNode.secondOperand);
      case '-':
        return evaluate(astNode.firstOperand) - evaluate(astNode.secondOperand);
      case '^':
        return (
          evaluate(astNode.firstOperand) ** evaluate(astNode.secondOperand)
        );
    }
  }
  if (typeof astNode === 'object' && astNode.type === 'CALL') {
    return funcsByName[astNode.func](...astNode.args);
  }
  console.error(astNode);
  throw new Error('Unknown node');
};

const compile = (astNode: any): string => {
  if (Array.isArray(astNode)) return compile(astNode[0]);
  if (typeof astNode === 'number') return '' + astNode;
  if (typeof astNode === 'object' && astNode.type === 'OPERATOR') {
    return `(${compile(astNode.firstOperand)} ${astNode.operator} ${compile(
      astNode.secondOperand,
    )})`;
  }
  if (typeof astNode === 'object' && astNode.type === 'CALL') {
    return `${astNode.func}(${astNode.args.join(',')})`;
  }
  console.error(astNode);
  throw new Error('Unknown node');
};

const parsed = parse(expression)('sum(2, 4, 10) * 3 + 2 * 2^(5 + 19) + 5 + 7');

if (parsed !== failure) {
  const ast = parsed[0];
  console.log(compile(ast));
  console.log(evaluate(ast));
}
