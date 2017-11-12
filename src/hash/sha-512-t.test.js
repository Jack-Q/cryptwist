import { generateIV } from './sha-512-t';

const w = i => Array.from(i).map(v => `00000000${v.toString(16)}`.slice(-8)).join(' ');

const iv256 = Uint32Array.of(
  0x22312194, 0xFC2BF72C,
  0x9F555FA3, 0xC84C64C2,
  0x2393B86B, 0x6F53B151,
  0x96387719, 0x5940EABD,
  0x96283EE2, 0xA88EFFE3,
  0xBE5E1E25, 0x53863992,
  0x2B0199FC, 0x2C85B8AA,
  0x0EB72DDC, 0x81C52CA2,
);
it('should generate IV for 256 bits correctly', () => expect(w(generateIV(256))).toEqual(w(iv256)));

const iv224 = Uint32Array.of(
  0x8C3D37C8, 0x19544DA2,
  0x73E19966, 0x89DCD4D6,
  0x1DFAB7AE, 0x32FF9C82,
  0x679DD514, 0x582F9FCF,
  0x0F6D2B69, 0x7BD44DA8,
  0x77E36F73, 0x04C48942,
  0x3F9D85A8, 0x6A1D36C8,
  0x1112E6AD, 0x91D692A1,
);
it('should generate IV for 256 bits correctly', () => expect(w(generateIV(224))).toEqual(w(iv224)));
