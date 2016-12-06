from hashlib import md5
from itertools import count, islice

with open('5.txt') as f:
    start = f.read().strip()

nums = count()
allHashes = (md5((start + str(i)).encode('utf-8')).hexdigest() for i in nums)
correctHashes = (currHash for currHash in allHashes if currHash.startswith('00000'))


def first(hashes):
    result = ''
    for currHash in islice(hashes, 8):
        result += currHash[5]
        yield currHash
    print(result)
    yield from hashes


def second(hashes):
    result = {}
    for currHash in hashes:
        position, char = (int(currHash[5], 16), currHash[6])
        if position < 8 and position not in result:
            result[position] = char
        if len(result) == 8:
            print(''.join([result[key] for key in result]))
            break


second(first(correctHashes))
