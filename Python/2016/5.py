import time
from hashlib import md5
from itertools import count, islice
from multiprocessing import Pool

with open('5.txt') as f:
    start = f.read().strip()


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


def hash_it(index):
    return md5((start + str(index)).encode('utf-8')).hexdigest()


if __name__ == '__main__':
    pool = Pool()
    nums = count()
    allHashes = pool.imap(hash_it, nums, 200000)
    # allHashes = (hash_it(i) for i in nums)
    correctHashes = (currHash for currHash in allHashes if currHash.startswith('00000'))
    startTime = time.time()
    second(first(correctHashes))
    end = time.time()
    print('Done after: ', int(end - startTime), ' seconds')
