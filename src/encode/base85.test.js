import TestEncoder from './encode.test-util';
import { Base85Encoder } from './base85';


const cases = [
  ['Hello World\0\0\0\0\0\0\0\0\0\0\0\0', '<~87cURD]i,"Ebo7dzz!!!!~>'],
  ['Hello World\0\0\0\0\0\0\0\0\0\0\0', '<~87cURD]i,"Ebo7dzz!!!~>'],
  ['Hello World\0\0\0\0\0\0\0\0\0\0', '<~87cURD]i,"Ebo7dzz!!~>'],
  ['Hello World\0\0\0\0\0', '<~87cURD]i,"Ebo7dz~>'],
  ['Hello World\0', '<~87cURD]i,"Ebo7d~>'],
  [
    [112, 213], '<~E7F~>',
  ],
  [
    [112, 132, 122], '<~E.iN~>',
  ],
  [
    [112, 142, 221, 229], '<~E/rc9~>',
  ],
  [
    [112, 207, 122, 119, 187], '<~E6iiS])~>',
  ],
  [
    [112, 111, 222, 98, 90, 12], '<~E,XTB=pt~>',
  ],
  ['Man is distinguished, not only by his reason, but by this singular' +
    ' passion from other animals, which is a lust of the mind, that by a' +
    ' perseverance of delight in the continued and indefatigable ' +
    'generation of knowledge, exceeds the short vehemence of any carnal pleasure.',

  '<~9jqo^BlbD-BleB1DJ+*+F(f,q/0JhKF<GL>Cj@.4Gp$d7F!,L7@<6@)/0JDEF<G%<+EV:2F!,' +
    'O<DJ+*.@<*K0@<6L(Df-\\0Ec5e;DffZ(EZee.Bl.9pF"AGXBPCsi+DGm>@3BB/F*&OCAfu2/A' +
    'KYi(DIb:@FD,*)+C]U=@3BN#EcYf8ATD3s@q?d$AftVqCh[NqF<G:8+EV:.+Cf>-FD5W8ARlolD' +
    "Ial(DId<j@<?3r@:F%a+D58'ATD4$Bl@l3De:,-DJs`8ARoFb/0JMK@qB4^F!,R<AKZ&-DfTqBG" +
    "%G>uD.RTpAKYo'+CT/5+Cei#DII?(E,9)oF*2M7/c~>",
  ],
];

TestEncoder(Base85Encoder, cases);

// other failure cases
it('should refuse to decode', () => expect(() => Base85Encoder.decode('<~!~>')).toThrowError(/invalid length of str/));
it('should refuse to decode', () => expect(() => Base85Encoder.decode('<~\0\0~>')).toThrowError(/unresolved content section/));
it('should refuse to decode', () => expect(() => Base85Encoder.decode('<~xyz~>')).toThrowError(/unresolved content section .* at/));
it('should refuse to decode', () => expect(() => Base85Encoder.decode('<~uu~>')).toThrowError(/unresolved content section/));
it('should refuse to decode', () => expect(() => Base85Encoder.decode()).toThrowError(/invalid length of str/));
it('should refuse to decode', () => expect(() => Base85Encoder.decode('uuuu')).toThrowError(/be wrapped into/));
