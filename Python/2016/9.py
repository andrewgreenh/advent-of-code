import re
from itertools import takewhile, islice

with open('9.txt') as f:
    input = f.read().strip()

reg = r'\(\d+x\d+\)'


def get_length(gen, recurse):
    count = 0
    while True:
        count += sum(1 for _ in takewhile(lambda i: i != '(', gen))
        command = ''.join(takewhile(lambda i: i != ')', gen))
        if len(command) == 0:
            break
        n, rep = map(int, re.findall(r'\d+', command))
        count += recurse(islice(gen, 0, n), recurse) * rep
    return count


print('Part 1:', get_length(iter(input), lambda i, _: len(list(i))))
print('Part 2:', get_length(iter(input), get_length))