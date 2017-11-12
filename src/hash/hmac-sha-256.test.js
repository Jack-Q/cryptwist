import { HmacSHA256 } from './hmac-sha-256';
import Encoder from '../encode';

const { decode, encode } = Encoder.HexEncoder;
const { decode: fromStr } = Encoder.AsciiEncoder;

/**
 * Test case from RFC2202
 */

const tests = [
  {
    key: decode('0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b'),
    msg: fromStr('Hi There'),
    mac: 'b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7',
  },
  {
    key: fromStr('Jefe'),
    msg: fromStr('what do ya want for nothing?'),
    mac: '5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843',
  },
  {
    key: decode('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
    msg: new Uint8Array(50).fill(0xdd),
    mac: '773ea91e36800e46854db8ebd09181a72959098b3ef8c122d9635514ced565fe',
  },
  {
    key: decode('0102030405060708090a0b0c0d0e0f10111213141516171819'),
    msg: new Uint8Array(50).fill(0xcd),
    mac: '82558a389a443c0ea4cc819899f2083a85f0faa3e578f8077a2e3ff46729665b',
  },
  // {
  //   key: decode('0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c'),
  //   msg: fromStr('Test With Truncation'),
  //   mac: 'a3b6167473100ee06e0c796c2955552b',
  // },
  {
    key: new Uint8Array(131).fill(0xaa),
    msg: fromStr('Test Using Larger Than Block-Size Key - Hash Key First'),
    mac: '60e431591ee0b67f0d8a26aacbf5b77f8e0bc6213728c5140546040f0ee37f54',
  },
  {
    key: new Uint8Array(131).fill(0xaa),
    msg: fromStr('This is a test using a larger than block-size key and a larger than block-size data. The key needs to be hashed before being used by the HMAC algorithm.'),
    mac: '9b09ffa71b942fcb27635fbcd5b0e944bfdc63644f0713938a7f51535c3a35e2',
  },
];

tests.forEach((t) => {
  it('should generate correct MAC', () =>
    expect(encode(new HmacSHA256(t.key).hash(t.msg))).toEqual(t.mac));
});

