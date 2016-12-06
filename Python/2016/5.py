from hashlib import md5
from itertools import count, islice

with open('2016/5.txt') as f:
    start = f.read().strip()

nums = count()
allHashes = (md5((start + str(i)).encode('utf-8')).hexdigest() for i in nums)
correctHashes = (hash for hash in allHashes if hash.startswith('00000'))


def first(hashes):
    result = ''
    for hash in islice(hashes, 8):
        result += hash[5]
        yield hash
    print(result)
    yield from hashes


def second(hashes):
    result = {}
    for hash in hashes:
        position, char = (int(hash[5], 16), hash[6])
        if position < 8 and position not in result:
            result[position] = char
        if len(result) == 8:
            print(''.join([result[key] for key in result]))
            break


second(first(correctHashes))
