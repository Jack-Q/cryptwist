import { shiftRows } from './shift-rows';
import { initState, exportState } from './state';
import Encode from '../../encode';

const { encode, decode } = Encode.HexEncoder;

const test = (a, b) => it('should shift rows as expected', () =>
  expect(encode(exportState(shiftRows(initState(decode(a)))))).toEqual(b));

const cases = [
  ['63cab7040953d051cd60e0e7ba70e18c', '6353e08c0960e104cd70b751bacad0e7'],
  ['a761ca9b97be8b45d8ad1a611fc97369', 'a7be1a6997ad739bd8c9ca451f618b61'],
  ['3b59cb73fcd90ee05774222dc067fb68', '3bd92268fc74fb735767cbe0c0590e2d'],
];

cases.map(c => test(...c));
