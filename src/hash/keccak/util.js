
export const retrieve = (arr, ind) => [arr[ind * 2], arr[ind * 2 + 1]];

export const assign = (arr, ind, h, l) => {
  arr[ind * 2] = h;
  arr[ind * 2 + 1] = l;
  return [h, l];
};

export const index = (x, y) => x + 5 * y;

export const rotL = (h, l, len) => (len > 32 ? [
  (l << (len - 32)) | (h >>> (64 - len)),
  (h << (len - 32)) | (l >>> (64 - len)),
] : [
  (h << len) | (l >>> (32 - len)),
  (l << len) | (h >>> (32 - len)),
]);

export const rotR = (h, l, len) => (len > 32 ? [
  (l >>> (len - 32)) | (h << (64 - len)),
  (h >>> (len - 32)) | (l << (64 - len)),
] : [
  (h >>> len) | (l << (32 - len)),
  (l >>> len) | (h << (32 - len)),
]);
