import { HmacSHA1 } from './hmac-sha-1';
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
    mac: 'b617318655057264e28bc0b6fb378c8ef146be00',
  },
  {
    key: fromStr('Jefe'),
    msg: fromStr('what do ya want for nothing?'),
    mac: 'effcdf6ae5eb2fa2d27416d5f184df9c259a7c79',
  },
  {
    key: decode('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
    msg: new Uint8Array(50).fill(0xdd),
    mac: '125d7342b9ac11cd91a39af48aa17b4f63f175d3',
  },
  {
    key: decode('0102030405060708090a0b0c0d0e0f10111213141516171819'),
    msg: new Uint8Array(50).fill(0xcd),
    mac: '4c9007f4026250c6bc8414f9bf50c86c2d7235da',
  },
  {
    key: decode('0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c'),
    msg: fromStr('Test With Truncation'),
    mac: '4c1a03424b55e07fe7f27be1d58bb9324a9a5a04',
  },
  {
    key: new Uint8Array(80).fill(0xaa),
    msg: fromStr('Test Using Larger Than Block-Size Key - Hash Key First'),
    mac: 'aa4ae5e15272d00e95705637ce8a3b55ed402112',
  },
  {
    key: new Uint8Array(80).fill(0xaa),
    msg: fromStr('Test Using Larger Than Block-Size Key and Larger Than One Block-Size Data'),
    mac: 'e8e99d0f45237d786d6bbaa7965c7808bbff1a91',
  },
];

tests.forEach((t) => {
  it('should generate correct MAC', () =>
    expect(encode(new HmacSHA1(t.key).hash(t.msg))).toEqual(t.mac));
});
