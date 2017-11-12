import { HmacMD5 } from './hmac-md5';
import { Encoder } from '../encode';

const { decode, encode } = Encoder.HexEncoder;
const { decode: fromStr } = Encoder.AsciiEncoder;

/**
 * Test case from RFC2202
 */

const tests = [
  {
    key: decode('0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b'),
    msg: fromStr('Hi There'),
    mac: '9294727a3638bb1c13f48ef8158bfc9d',
  },
  {
    key: fromStr('Jefe'),
    msg: fromStr('what do ya want for nothing?'),
    mac: '750c783e6ab0b503eaa86e310a5db738',
  },
  {
    key: decode('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'),
    msg: new Uint8Array(50).fill(0xdd),
    mac: '56be34521d144c88dbb8c733f0e8b3f6',
  },
  {
    key: decode('0102030405060708090a0b0c0d0e0f10111213141516171819'),
    msg: new Uint8Array(50).fill(0xcd),
    mac: '697eaf0aca3a3aea3a75164746ffaa79',
  },
  {
    key: decode('0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c'),
    msg: fromStr('Test With Truncation'),
    mac: '56461ef2342edc00f9bab995690efd4c',
  },
  {
    key: new Uint8Array(80).fill(0xaa),
    msg: fromStr('Test Using Larger Than Block-Size Key - Hash Key First'),
    mac: '6b1ab7fe4bd7bf8f0b62e6ce61b9d0cd',
  },
  {
    key: new Uint8Array(80).fill(0xaa),
    msg: fromStr('Test Using Larger Than Block-Size Key and Larger Than One Block-Size Data'),
    mac: '6f630fad67cda0ee1fb1f562db3aa53e',
  },
];

tests.forEach((t) => {
  it('should generate correct MAC', () =>
    expect(encode(new HmacMD5(t.key).hash(t.msg))).toEqual(t.mac));
});
