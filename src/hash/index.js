import { Hmac } from './hmac';
import { HmacMD5 } from './hmac-md5';
import { HmacSHA1 } from './hmac-sha-1';
import { HmacSHA224 } from './hmac-sha-224';
import { HmacSHA256 } from './hmac-sha-256';
import { HmacSHA384 } from './hmac-sha-384';
import { HmacSHA512 } from './hmac-sha-512';
import { MD2Hash } from './md2';
import { MD4Hash } from './md4';
import { MD5Hash } from './md5';
import { RIPEMD128Hash } from './ripemd-128';
import { RIPEMD160Hash } from './ripemd-160';
import { RIPEMD256Hash } from './ripemd-256';
import { RIPEMD320Hash } from './ripemd-320';
import { SHA1Hash } from './sha-1';
import { SHA224Hash } from './sha-224';
import { SHA256Hash } from './sha-256';
import { SHA384Hash } from './sha-384';
import { SHA512Hash } from './sha-512';
import { SHA512t224Hash } from './sha-512-224';
import { SHA512t256Hash } from './sha-512-256';
import { SHA512THash } from './sha-512-t';
import { SHA3_224Hash } from './sha3-224'; // eslint-disable-line camelcase
import { SHA3_256Hash } from './sha3-256'; // eslint-disable-line camelcase
import { SHA3_384Hash } from './sha3-384'; // eslint-disable-line camelcase
import { SHA3_512Hash } from './sha3-512'; // eslint-disable-line camelcase
import { SHAKE128Hash } from './shake-128';
import { SHAKE256Hash } from './shake-256';

const hashList = [
  Hmac,
  HmacMD5,
  HmacSHA1,
  HmacSHA224,
  HmacSHA256,
  HmacSHA384,
  HmacSHA512,
  MD2Hash,
  MD4Hash,
  MD5Hash,
  RIPEMD128Hash,
  RIPEMD160Hash,
  RIPEMD256Hash,
  RIPEMD320Hash,
  SHA1Hash,
  SHA224Hash,
  SHA256Hash,
  SHA384Hash,
  SHA512Hash,
  SHA512t224Hash,
  SHA512t256Hash,
  SHA512THash,
  SHA3_224Hash, // eslint-disable-line camelcase
  SHA3_256Hash, // eslint-disable-line camelcase
  SHA3_384Hash, // eslint-disable-line camelcase
  SHA3_512Hash, // eslint-disable-line camelcase
  SHAKE128Hash,
  SHAKE256Hash,
];

const getHash = name => hashList.find(i => i.name === name);

const Hash = {
  Hmac,
  HmacMD5,
  HmacSHA1,
  HmacSHA224,
  HmacSHA256,
  HmacSHA384,
  HmacSHA512,
  MD2Hash,
  MD4Hash,
  MD5Hash,
  RIPEMD128Hash,
  RIPEMD160Hash,
  RIPEMD256Hash,
  RIPEMD320Hash,
  SHA1Hash,
  SHA224Hash,
  SHA256Hash,
  SHA384Hash,
  SHA512Hash,
  SHA512t224Hash,
  SHA512t256Hash,
  SHA512THash,
  SHA3_224Hash, // eslint-disable-line camelcase
  SHA3_256Hash, // eslint-disable-line camelcase
  SHA3_384Hash, // eslint-disable-line camelcase
  SHA3_512Hash, // eslint-disable-line camelcase
  SHAKE128Hash,
  SHAKE256Hash,

  hashList,
  getHash,
};


export { Hmac } from './hmac';
export { HmacMD5 } from './hmac-md5';
export { HmacSHA1 } from './hmac-sha-1';
export { HmacSHA224 } from './hmac-sha-224';
export { HmacSHA256 } from './hmac-sha-256';
export { HmacSHA384 } from './hmac-sha-384';
export { HmacSHA512 } from './hmac-sha-512';
export { MD2Hash } from './md2';
export { MD4Hash } from './md4';
export { MD5Hash } from './md5';
export { RIPEMD128Hash } from './ripemd-128';
export { RIPEMD160Hash } from './ripemd-160';
export { RIPEMD256Hash } from './ripemd-256';
export { RIPEMD320Hash } from './ripemd-320';
export { SHA1Hash } from './sha-1';
export { SHA224Hash } from './sha-224';
export { SHA256Hash } from './sha-256';
export { SHA384Hash } from './sha-384';
export { SHA512Hash } from './sha-512';
export { SHA512t224Hash } from './sha-512-224';
export { SHA512t256Hash } from './sha-512-256';
export { SHA512THash } from './sha-512-t';
export { SHA3_224Hash } from './sha3-224'; // eslint-disable-line camelcase
export { SHA3_256Hash } from './sha3-256'; // eslint-disable-line camelcase
export { SHA3_384Hash } from './sha3-384'; // eslint-disable-line camelcase
export { SHA3_512Hash } from './sha3-512'; // eslint-disable-line camelcase
export { SHAKE128Hash } from './shake-128';
export { SHAKE256Hash } from './shake-256';
export { getHash, hashList, Hash };
export default Hash;
