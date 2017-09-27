import TestEncoder from './encode.test-util';
import Base64 from './base64';

const cases = [
  ['Hello', 'SGVsbG8='],
  ['Test', 'VGVzdA=='],
  ['JavaScript.jest', 'SmF2YVNjcmlwdC5qZXN0'],
  [[0, 1, 2, 3, 4, 5, 6, 7], 'AAECAwQFBgc='],
];

TestEncoder(Base64, cases);


// other failure cases
it('should refuse to decode', () => expect(() => Base64.decode('~~===')).toThrowError(/invalid length of str/));
it('should refuse to decode', () => expect(() => Base64.decode()).toThrowError(/invalid length of str/));
it('should refuse to decode', () => expect(() => Base64.decode('')).toThrowError(/invalid length of str/));
it('should refuse to decode', () => expect(() => Base64.decode('TEST+===')).toThrowError(/invalid length of padding string/));
it('should refuse to decode', () => expect(() => Base64.decode('TES#++==')).toThrowError(/unexpected value/));
it('should refuse to decode', () => expect(() => Base64.decode('i*12=i+1')).toThrowError(/invalid character found at the end/));
