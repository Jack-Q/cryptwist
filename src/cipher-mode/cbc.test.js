import { CBCCipherMode } from './cbc';
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
      '7649abac8119b246cee98e9b12e9197d',
      '5086cb9b507219ee95db113a917678b2',
      '73bed6b8e3c1743b7116e69e22229516',
      '3ff1caa1681fac09120eca307586e1a7',
    ].join('')),
  ],
  [
    AES192BlockCipher,
    dec('8e73b0f7da0e6452c810f32b809079e562f8ead2522c6b7b'),
    dec('000102030405060708090a0b0c0d0e0f'),
    dec([
      '4f021db243bc633d7178183a9fa071e8',
      'b4d9ada9ad7dedf4e5e738763f69145a',
      '571b242012fb7ae07fa9baac3df102e0',
      '08b0e27988598881d920a9e64f5615cd',
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
      'f58c4c04d6e5f1ba779eabfb5f7bfbd6',
      '9cfc4e967edb808d679f777bc6702c7d',
      '39f23369a9d9bacfa530e26304231461',
      'b2eb05e2c39be9fcda6c19078c6a9d1b',
    ].join('')),
  ],
];

testCipher(CBCCipherMode, plainText, cbcTestCases);
testDecipher(CBCCipherMode, plainText, cbcTestCases);
