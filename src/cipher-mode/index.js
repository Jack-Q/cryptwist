import { ECBCipherMode } from './ecb';
import { CBCCipherMode } from './cbc';
import { CFBCipherMode } from './cfb';
import { OFBCipherMode } from './ofb';
import { CTRCipherMode } from './ctr';


const cipherModeList = [
  ECBCipherMode,
  CBCCipherMode,
  CFBCipherMode,
  OFBCipherMode,
  CTRCipherMode,
];

const getCipherMode = title => cipherModeList.find(i => i.title === title);
const CipherMode = {
  ECBCipherMode,
  CBCCipherMode,
  CFBCipherMode,
  OFBCipherMode,
  CTRCipherMode,

  getCipherMode,
  cipherModeList,
};

export { ECBCipherMode } from './ecb';
export { CBCCipherMode } from './cbc';
export { CFBCipherMode } from './cfb';
export { OFBCipherMode } from './ofb';
export { CTRCipherMode } from './ctr';
export { getCipherMode, cipherModeList, CipherMode };
export default CipherMode;
