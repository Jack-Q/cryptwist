const reverseBitMap = [
  0b0000, 0b1000, 0b0100, 0b1100, 0b0010, 0b1010, 0b0110, 0b1110,
  0b0001, 0b1001, 0b0101, 0b1101, 0b0011, 0b1011, 0b0111, 0b1111,
];
export const reverseBits = (i, len) => {
  if (len > 8) return ((reverseBits(i & 0xff) << (len - 8)) | reverseBits(i >>> (len - 8)), 8);
  if (len < 5) return reverseBitMap[i & 0xf] >>> (4 - len);
  return ((reverseBitMap[i & 0xf] << 4) | reverseBitMap[(i >>> 4) & 0xf]) >>> (8 - len);
};
export default { reverseBits };
