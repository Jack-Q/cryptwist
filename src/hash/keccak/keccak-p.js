import { iota } from './iota';
import { theta } from './theta';
import { rho } from './rho';
import { pi } from './pi';
import { chi } from './chi';

const round = (state, iR) => iota(chi(pi(rho(theta(state)))), iR);

// Following code are used for debug to dump intermediate result to console

// let t = 0;
// const dumpState = (m, s) => t++ < 6 &&
//   console.log(`${m}\n${
//     Array.from(s)
//       .map((v, i) => `${
//         `00000000${v.toString(16)}`
//         .slice(-8)
//         .match(/../g)
//         .reverse()
//         .join('')
//         }${
//           i % 2 ? '\n' : ' '
//         }`)
//       .join('')
//       .split('\n')
//       .map(i => i.split(' ').reverse().join(' '))
//       .map((v, i) => v + (i % 2 ? '\n' : ' '))
//       .join('')}`);

// const round = (state, iR) => {
//   dumpState('pre', state);
//   const sT = theta(state);
//   dumpState('theta', state);
//   const sR = rho(sT);
//   dumpState('rho', state);
//   const sP = pi(sR);
//   dumpState('pi', state);
//   const sC = chi(sP);
//   dumpState('chi', state);
//   const sI = iota(sC, iR);
//   dumpState('iota', state);
//   return sI;
// };

export const keccakP = (b, nR, state) => {
  const l = {
    1: 0,
    2: 1,
    4: 2,
    8: 3,
    16: 4,
    32: 5,
    64: 6,
    128: 7,
  }[b / 25];
  if (l !== 6) {
    throw 'currently, the Keccak-p function only support permutation on 1600 bits';
  }
  const sR = 12 + 2 * l;
  for (let i = sR - nR; i < sR; i += 1) {
    round(state, i);
  }
  return state;
};

export default keccakP;
