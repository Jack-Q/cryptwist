beforeEach(() => {
  console.warn = jest.fn((error) => {
    throw new Error(`warning${error}`);
  });
});

const rnd = n => Array(n).fill(0).map(() => Math.floor(255 * Math.random()));

const testEncoderObject = (encoder) => {
  it('should has title property', () => expect(typeof encoder.title).toBe('string'));
  it('should contain encode method', () => expect(typeof encoder.encode).toBe('function'));
  it('should contain decode method', () => expect(typeof encoder.decode).toBe('function'));
};

const testEncoderFunction = (encoder, src, exp) => {
  const plain = typeof src === 'string' ?
    Uint8Array.from(src.split('').map(s => s.charCodeAt(0))) : Uint8Array.from(src);
  const offset = rnd(1)[0];
  it(`should encode ${src} as ${exp}`, () => expect(encoder.encode(plain)).toBe(exp));
  it(`should encode ${src} (with offset) as ${exp}`, () =>
    expect(encoder.encode(Uint8Array.from([
      ...rnd(offset),
      ...plain,
      ...rnd(...rnd(1)),
    ]), plain.length, offset)).toBe(exp));
  it(`should decode ${exp} as ${src}`, () => expect(encoder.decode(exp)).toEqual(plain));
};

const testEncoder = (encoder, cases) => {
  testEncoderObject(encoder);

  it('should warn to encode', () => expect(() => encoder.encode([0, 2, 3])).toThrow(/^warning/));
  it('should warn to decode', () => expect(() => encoder.decode([])).toThrow(/^warning/));

  const func = testEncoderFunction.bind(null, encoder);
  cases.forEach(v => func(...v));
};

export default testEncoder;
