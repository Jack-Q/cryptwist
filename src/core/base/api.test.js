import {
  TODO,
  BlockCipher,
  StreamCipher,
} from './api';

it('should throw default TODO message', () => expect(() => TODO(null)).toThrow(/TODO/));

/**
 * Check the required member of class contain TODO check
 *
 * @param {object} ClassName
 * @param {String[]} requiredMembers
 */
const checkSubclassImplementation = (ClassName, requiredMembers) => {
  class EmptyImpl extends ClassName { }
  const inst = new EmptyImpl();
  requiredMembers.map(m =>
    it(`should check implementation of ${m} in subclass`, () =>
      expect(() => (typeof inst[m] === 'function' ? inst[m]() : inst[m]))
        .toThrow(/TODO/)),
  );
};


checkSubclassImplementation(StreamCipher, ['stream', 'encrypt', 'decrypt']);
checkSubclassImplementation(BlockCipher, ['encrypt', 'decrypt']);
