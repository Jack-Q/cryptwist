import { assign, retrieve, index, rotR } from './util';

export const rho = (state) => {
  for (let t = 0, x = 1, y = 0; t < 24; t += 1) {
    // shift the index
    assign(state, index(x, y),
      ...rotR(
        ...retrieve(state, index(x, y)),
        ((t + 1) * (t + 2) / 2) % 64,
      ),
    );

    // update index
    [x, y] = [y, (2 * x + 3 * y) % 5];
  }
  return state;
};


export default rho;
