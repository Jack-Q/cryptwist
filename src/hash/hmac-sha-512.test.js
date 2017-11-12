import { HmacSHA512 } from './hmac-sha-512';
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
    mac: '87aa7cdea5ef619d4ff0b4241a1d6cb02379f4e2ce4ec2787ad0b30545e17cdedaa833b7d6b8a702038b274eaea3f4e4be9d914eeb61f1702e696c203a126854',
  },
  {
    key: fromStr('Jefe'),
    msg: fromStr('what do ya want for nothing?'),
    mac: '164b7a7bfcf819e2e395fbe73b56e0a387bd64222e831fd610270cd7ea2505549758bf75c05a994a6d034f65f8f0e6fdcaeab1a34d4a6b4b636e070a38bce737',
  },
  {
    key: decode('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
    msg: new Uint8Array(50).fill(0xdd),
    mac: 'fa73b0089d56a284efb0f0756c890be9b1b5dbdd8ee81a3655f83e33b2279d39bf3e848279a722c806b485a47e67c807b946a337bee8942674278859e13292fb',
  },
  {
    key: decode('0102030405060708090a0b0c0d0e0f10111213141516171819'),
    msg: new Uint8Array(50).fill(0xcd),
    mac: 'b0ba465637458c6990e5a8c5f61d4af7e576d97ff94b872de76f8050361ee3dba91ca5c11aa25eb4d679275cc5788063a5f19741120c4f2de2adebeb10a298dd',
  },
  // {
  //   key: decode('0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c'),
  //   msg: fromStr('Test With Truncation'),
  //   mac: '415fad6271580a531d4179bc891d87a6',
  // },
  {
    key: new Uint8Array(131).fill(0xaa),
    msg: fromStr('Test Using Larger Than Block-Size Key - Hash Key First'),
    mac: '80b24263c7c1a3ebb71493c1dd7be8b49b46d1f41b4aeec1121b013783f8f3526b56d037e05f2598bd0fd2215d6a1e5295e64f73f63f0aec8b915a985d786598',
  },
  {
    key: new Uint8Array(131).fill(0xaa),
    msg: fromStr('This is a test using a larger than block-size key and a larger than block-size data. The key needs to be hashed before being used by the HMAC algorithm.'),
    mac: 'e37b6a775dc87dbaa4dfa9f96e5e3ffddebd71f8867289865df5a32d20cdc944b6022cac3c4982b10d5eeb55c3e4de15134676fb6de0446065c97440fa8c6a58',
  },
];

tests.forEach((t) => {
  it('should generate correct MAC', () =>
    expect(encode(new HmacSHA512(t.key).hash(t.msg))).toEqual(t.mac));
});

