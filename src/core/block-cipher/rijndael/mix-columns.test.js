import { mixColumns } from './mix-columns';
import { initState, exportState } from './state';
import Encode from '../../encode';

const { encode, decode } = Encode.HexEncoder;

const test = (a, b) => it('should mix columns as expected', () =>
  expect(encode(exportState(mixColumns(initState(decode(a)))))).toEqual(b));

const cases = [
  ['6353e08c0960e104cd70b751bacad0e7', '5f72641557f5bc92f7be3b291db9f91a'],
  ['a7be1a6997ad739bd8c9ca451f618b61', 'ff87968431d86a51645151fa773ad009'],
  ['3bd92268fc74fb735767cbe0c0590e2d', '4c9c1e66f771f0762c3f868e534df256'],
];

cases.map(c => test(...c));
