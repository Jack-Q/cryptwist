// initial permutation table
const ip = [
  58, 50, 42, 34, 26, 18, 10, 2,
  60, 52, 44, 36, 28, 20, 12, 4,
  62, 54, 46, 38, 30, 22, 14, 6,
  64, 56, 48, 40, 32, 24, 16, 8,
  57, 49, 41, 33, 25, 17, 9, 1,
  59, 51, 43, 35, 27, 19, 11, 3,
  61, 53, 45, 37, 29, 21, 13, 5,
  63, 55, 47, 39, 31, 23, 15, 7,
];

// final permutation IP^-1
const fp = [
  40, 8, 48, 16, 56, 24, 64, 32,
  39, 7, 47, 15, 55, 23, 63, 31,
  38, 6, 46, 14, 54, 22, 62, 30,
  37, 5, 45, 13, 53, 21, 61, 29,
  36, 4, 44, 12, 52, 20, 60, 28,
  35, 3, 43, 11, 51, 19, 59, 27,
  34, 2, 42, 10, 50, 18, 58, 26,
  33, 1, 41, 9, 49, 17, 57, 25,
];

const dataToInt = ([leftArr, rightArr]) => [
  leftArr[0] << 24 | leftArr[1] << 16 | leftArr[2] << 8 | leftArr[3],
  rightArr[0] << 24 | rightArr[1] << 16 | rightArr[2] << 8 | rightArr[3],
];

const permute = (data, table) => {
  const [left, right] = dataToInt(data);
  const result = [new Uint8Array(4).fill(0), new Uint8Array(4).fill(0)];
  for (let i = 0; i < 64; i += 1) {
    const ind = table[i] - 1;
    const bit = (ind < 32 ? left >> (31 - ind) : right >>> (63 - ind)) & 0b1;
    if (bit === 0b1) {
      result[i < 32 ? 0 : 1][Math.floor(i % 32 / 8)] |= 0b1 << (7 - i % 8);
    }
  }
  return result;
};

export const initialPermute = data => permute(data, ip);

export const finalPermute = data => permute(data, fp);

export const initialBitPermute = (data) => {
  let [left, right] = dataToInt(data);
  let work = 0;

  right = right << 4 | right >>> (32 - 4);
  work = (left ^ right) & 0xf0f0f0f0;
  left ^= work;
  right = (right ^ work) >>> 20 | (right ^ work) << (32 - 20);
  work = (left ^ right) & 0xffff0000;
  left ^= work;
  right = (right ^ work) >>> 18 | (right ^ work) << (32 - 18);
  work = (left ^ right) & 0x33333333;
  left ^= work;
  right = (right ^ work) >>> 6 | (right ^ work) << (32 - 6);
  work = (left ^ right) & 0x00ff00ff;
  left ^= work;
  right = (right ^ work) << 9 | (right ^ work) >>> (32 - 9);
  work = (left ^ right) & 0xaaaaaaaa;
  left = (left ^ work) << 1 | (left ^ work) >>> (32 - 1);
  right ^= work;

  return [
    Uint8Array.of((left >>> 24) & 0xff, (left >>> 16) & 0xff, (left >>> 8) & 0xff, left & 0xff),
    Uint8Array.of((right >>> 24) & 0xff, (right >>> 16) & 0xff, (right >>> 8) & 0xff, right & 0xff),
  ];
};

export const finalBitPermute = (data) => {
  let [left, right] = dataToInt(data);
  let work = 0;

  right = right >>> 1 | right << (32 - 1);
  work = (left ^ right) & 0xaaaaaaaa;
  right ^= work;
  left = (left ^ work) >>> 9 | (left ^ work) << (32 - 9);
  work = (left ^ right) & 0x00ff00ff;
  right ^= work;
  left = (left ^ work) << 6 | (left ^ work) >>> (32 - 6);
  work = (left ^ right) & 0x33333333;
  right ^= work;
  left = (left ^ work) << 18 | (left ^ work) >>> (32 - 18);
  work = (left ^ right) & 0xffff0000;
  right ^= work;
  left = (left ^ work) << 20 | (left ^ work) >>> (32 - 20);
  work = (left ^ right) & 0xf0f0f0f0;
  right ^= work;
  left = (left ^ work) >>> 4 | (left ^ work) << (32 - 4);

  return [
    Uint8Array.of((left >>> 24) & 0xff, (left >>> 16) & 0xff, (left >>> 8) & 0xff, left & 0xff),
    Uint8Array.of((right >>> 24) & 0xff, (right >>> 16) & 0xff, (right >>> 8) & 0xff, right & 0xff),
  ];
};

export default { initialPermute, finalPermute, initialBitPermute, finalBitPermute };
