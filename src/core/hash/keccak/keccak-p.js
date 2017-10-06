import { iota } from './iota';
import { theta } from './theta';
import { rho } from './rho';
import { pi } from './pi';
import { chi } from './chi';

const round = (state, iR) => iota(chi(pi(rho(theta(state)))), iR);

// const round = (state, iR) => {
//   const sT = theta(state);
//   const sR = rho(sT);
//   const sP = pi(sR);
//   const sC = chi(sP);
//   const sI = iota(sC, iR);
//   return sI;
// };

export const keccakP = (b, nR, state) => {
  const l = { 1: 0, 2: 1, 4: 2, 8: 3, 16: 4, 32: 5, 64: 6, 128: 7 }[b / 25];
  if (l !== 6) {
    throw 'currently, the Keccak-p function only support permutation on 1600 bits';
  }
  for (let i = l - nR; i < l; i += 1) {
    round(state, i);
  }
  return state;
};

export default keccakP;
