import { CFBCipherMode } from './cfb';
import { AES128BlockCipher, AES192BlockCipher, AES256BlockCipher } from '../block-cipher';
import { HexEncoder } from '../encode';
import { testCipher, testDecipher } from './test.util';

const { decode: dec } = HexEncoder;

const plainText = dec([
  '6bc1bee22e409f96e93d7e117393172a',
  'ae2d8a571e03ac9c9eb76fac45af8e51',
  '30c81c46a35ce411e5fbc1191a0a52ef',
  'f69f2445df4f9b17ad2b417be66c3710',
].join(''));

const cbcTestCases = [
  [
    AES128BlockCipher,
    dec('2b7e151628aed2a6abf7158809cf4f3c'),
    dec('000102030405060708090a0b0c0d0e0f'),
    dec([
      '3b3fd92eb72dad20333449f8e83cfb4a',
      'c8a64537a0b3a93fcde3cdad9f1ce58b',
      '26751f67a3cbb140b1808cf187a4f4df',
      'c04b05357c5d1c0eeac4c66f9ff7f2e6',
    ].join('')),
  ],
  [
    AES192BlockCipher,
    dec('8e73b0f7da0e6452c810f32b809079e562f8ead2522c6b7b'),
    dec('000102030405060708090a0b0c0d0e0f'),
    dec([
      'cdc80d6fddf18cab34c25909c99a4174',
      '67ce7f7f81173621961a2b70171d3d7a',
      '2e1e8a1dd59b88b1c8e60fed1efac4c9',
      'c05f9f9ca9834fa042ae8fba584b09ff',
    ].join('')),
  ],
  [
    AES256BlockCipher,
    dec([
      '603deb1015ca71be2b73aef0857d7781',
      '1f352c073b6108d72d9810a30914dff4',
    ].join('')),
    dec('000102030405060708090a0b0c0d0e0f'),
    dec([
      'dc7e84bfda79164b7ecd8486985d3860',
      '39ffed143b28b1c832113c6331e5407b',
      'df10132415e54b92a13ed0a8267ae2f9',
      '75a385741ab9cef82031623d55b1e471',
    ].join('')),
  ],
];

testCipher(CFBCipherMode, plainText, cbcTestCases);
testDecipher(CFBCipherMode, plainText, cbcTestCases);
