import { SHA512THash } from './sha-512-t';

export class SHA512t256Hash extends SHA512THash {
  constructor() {
    super(256);
  }
  static hash(data) {
    return SHA512t256Hash.hash(data);
  }
}

export default SHA512t256Hash;
