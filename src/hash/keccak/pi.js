import { assign, retrieve, index } from './util';

export const pi = (state) => {
  const o = Uint32Array.from(state);
  for (let x = 0; x < 5; x += 1) {
    for (let y = 0; y < 5; y += 1) {
      assign(
        state, index(x, y),
        ...retrieve(
          o,
          index((x + 3 * y) % 5, x),
        ),
      );
    }
  }
  return state;
};
export default pi;
