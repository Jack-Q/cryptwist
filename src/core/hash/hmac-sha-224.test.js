import { HmacSHA224 } from './hmac-sha-224';
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
    mac: '896fb1128abbdf196832107cd49df33f47b4b1169912ba4f53684b22',
  },
  {
    key: fromStr('Jefe'),
    msg: fromStr('what do ya want for nothing?'),
    mac: 'a30e01098bc6dbbf45690f3a7e9e6d0f8bbea2a39e6148008fd05e44',
  },
  {
    key: decode('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
    msg: new Uint8Array(50).fill(0xdd),
    mac: '7fb3cb3588c6c1f6ffa9694d7d6ad2649365b0c1f65d69d1ec8333ea',
  },
  {
    key: decode('0102030405060708090a0b0c0d0e0f10111213141516171819'),
    msg: new Uint8Array(50).fill(0xcd),
    mac: '6c11506874013cac6a2abc1bb382627cec6a90d86efc012de7afec5a',
  },
  // {
  //   key: decode('0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c'),
  //   msg: fromStr('Test With Truncation'),
  //   mac: '0e2aea68a90c8d37c988bcdb9fca6fa8',
  // },
  {
    key: new Uint8Array(131).fill(0xaa),
    msg: fromStr('Test Using Larger Than Block-Size Key - Hash Key First'),
    mac: '95e9a0db962095adaebe9b2d6f0dbce2d499f112f2d2b7273fa6870e',
  },
  {
    key: new Uint8Array(131).fill(0xaa),
    msg: fromStr('This is a test using a larger than block-size key and a larger than block-size data. The key needs to be hashed before being used by the HMAC algorithm.'),
    mac: '3a854166ac5d9f023f54d517d0b39dbd946770db9c2b95c9f6f565d1',
  },
];

tests.forEach((t) => {
  it('should generate correct MAC', () =>
    expect(encode(new HmacSHA224(t.key).hash(t.msg))).toEqual(t.mac));
});

