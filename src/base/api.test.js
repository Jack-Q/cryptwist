import {
  TODO,
  BlockCipher,
  StreamCipher,
  Hash,
} from './api';

it('should throw default TODO message', () => expect(() => TODO(null)).toThrow(/TODO/));

/**
 * Check the required member of class contain TODO check
 *
 * @param {object} ClassName
 * @param {String[]} requiredMembers
 */
const checkSubclassImplementation = (ClassName, requiredMembers) => {
  const inst = {};
  // use prototype assignment to avoid invocation of constructor
  Object.setPrototypeOf(inst, ClassName.prototype);
  requiredMembers.map(m =>
    it(`should check implementation of ${m} in subclass`, () =>
      expect(() => (typeof inst[m] === 'function' ? inst[m]() : inst[m]))
        .toThrow(/TODO/)),
  );
};


checkSubclassImplementation(StreamCipher, ['stream', 'encrypt', 'decrypt']);
checkSubclassImplementation(BlockCipher, ['encrypt', 'decrypt']);
checkSubclassImplementation(Hash, ['feedData', 'endData', 'reset', 'hash']);
