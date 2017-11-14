
const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';


const parseBinAligned = (str, radix, len) => {
  const arr = [];
  for (let pos = str.length; pos > 0; pos -= len) {
    arr.push(parseInt(str.slice(Math.max(pos - len, 0), pos), radix));
  }
  return arr;
};

const parseStringBin = str => parseBinAligned(str, 2, 16);
const parseStringQuat = str => parseBinAligned(str, 4, 8);
const parseStringOct = (str) => {
  const arr = [];
  let res = 0;
  let resLen = 0;
  for (let pos = str.length; pos > 0;) {
    const len = resLen === 3 ? 4 : 5;
    let val = parseInt(str.slice(Math.max(pos - len, 0), pos), 8);
    pos -= len;

    val = val << len | res;
    res = val >>> 16;
    val &= 0xffff;
    resLen = resLen === 3 ? 0 : resLen + 1;

    arr.push(val);
  }
  if (res > 0) arr.push(res);
  return arr;
};
const parseStringHex = str => parseBinAligned(str, 16, 4);
const parseStringDtr = (str) => {

};

/**
 * @param {string} str all lower case
 * @param {number} radix within 2 to 36
 */
export const parseBinString = (str, radix) => {
  // trim leading 0s
  const s = str.replace(/^0*/, '');
  if (s === '') return [0];

  switch (radix) {
    case 2: return parseStringBin(str);
    case 4: return parseStringQuat(str);
    case 8: return parseStringOct(str);
    case 16: return parseStringHex(str);
    case 32: return parseStringDtr(str);
    default:
      return undefined;
  }
};

export default parseBinString;
