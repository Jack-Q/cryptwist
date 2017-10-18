import { HmacMD5 } from './hmac-md5';
import Encoder from '../encode';

const { decode, encode } = Encoder.HexEncoder;
const { decode: fromStr } = Encoder.AsciiEncoder;

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
];

tests.forEach((t) => {
  it('should generate correct MAC', () =>
    expect(encode(new HmacMD5(t.key).hash(t.msg))).toEqual(t.mac));
});
