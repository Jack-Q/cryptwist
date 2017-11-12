import { xor } from './des-func';

export const feistelStructure = (f, subKey, data, round = subKey.length) => {
  let result = data;
  for (let i = 0; i < round; i += 1) {
    result = [result[1], xor(result[0], f(result[1], subKey[i]))];
  }
  // reverse the swap in the last round
  return result.reverse();
};

export default feistelStructure;
