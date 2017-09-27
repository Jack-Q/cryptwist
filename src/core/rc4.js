const swap = (array, p, q) => {
  array[q] ^= array[p]; // eslint-disable-line
  array[p] ^= array[q]; // eslint-disable-line
  array[q] ^= array[p]; // eslint-disable-line
  return array;
};


const KSA_SIZE = 256;

const ksa = (key) => {
  const keyLength = key.length;
  const array = new Uint8Array(KSA_SIZE).fill(0).map((v, i) => i);
  for (let i = 0, j = 0; i < KSA_SIZE; i += 1) {
    j = (j + array[i] + key[i % keyLength]) % KSA_SIZE;
    swap(array, i, j);
  }
  return array;
};

console.log(ksa(Uint8Array.from([1, 2, 3, 4, 5, 9, 3, 1])));
