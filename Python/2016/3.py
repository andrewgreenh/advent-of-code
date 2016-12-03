import numpy as np

with open('2016/3.txt') as f:
    input = f.read().strip()

data = [[int(num) for num in line.split()] for line in input.split('\n')]
data1 = np.sort(data).T
data2 = np.sort(np.transpose(data).reshape((-1, 3))).T

print(sum(sum(data1[:2]) > data1[2]))
print(sum(sum(data2[:2]) > data2[2]))
