import re
from itertools import islice

with open('7.txt') as f:
    lines = f.read().strip().split('\n')

def window(seq, n):
    it = iter(seq)
    result = tuple(islice(it, n))
    if len(result) == n:
        yield result
    for elem in it:
        result = result[1:] + (elem,)
        yield result


def abba(x):
    return any(a == d and b == c and a != b for a, b, c, d in window(x, 4))

lines = [re.split(r'\[([^\]]+)\]', line) for line in lines]
parts = [(' '.join(p[::2]), ' '.join(p[1::2])) for p in lines]

print('Answer #1:', sum(abba(sn) and not (abba(hn)) for sn, hn in parts))
print('Answer #2:',
      sum(any(a == c and a != b and b + a + b in hn for a, b, c in window(sn, 3)) for sn, hn in parts))
