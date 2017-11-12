import { SHA512THash } from './sha-512-t';

export class SHA512t224Hash extends SHA512THash {

  static name = 'sha-512/224';

  constructor() {
    super(224);
  }
  static hash(data) {
    return SHA512t224Hash.hash(data);
  }
}

export default SHA512t224Hash;
