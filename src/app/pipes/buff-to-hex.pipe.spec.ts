import { BuffToHexPipe } from './buff-to-hex.pipe';

describe('BuffToHexPipe', () => {
  it('create an instance', () => {
    const pipe = new BuffToHexPipe();
    expect(pipe).toBeTruthy();
  });
});
