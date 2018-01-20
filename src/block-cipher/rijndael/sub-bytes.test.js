import { subBytes, S_BOX, constructSBox } from './sub-bytes';
import { initState, exportState } from './state';
import Encode from '../../encode';

const { encode, decode } = Encode.HexEncoder;

const test = (a, b) => it('should transform as expected', () =>
  expect(encode(exportState(subBytes(initState(decode(a)))))).toEqual(b));

const cases = [
  ['00102030405060708090a0b0c0d0e0f0', '63cab7040953d051cd60e0e7ba70e18c'],
  ['89d810e8855ace682d1843d8cb128fe4', 'a761ca9b97be8b45d8ad1a611fc97369'],
  ['4915598f55e5d7a0daca94fa1f0a63f7', '3b59cb73fcd90ee05774222dc067fb68'],
];

cases.map(c => test(...c));

it('constructed S-Box should equal to predefined one', () => expect(constructSBox()).toEqual(S_BOX));

