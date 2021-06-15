import shorten from '../src/utils/shorten';

describe('test the shorten function', () => {
    it('should not shorten the string', () => {
        const str = shorten('hello oasis!');

        expect(str).toBe('hello oasis!');
    });

    it('should shorten the string', () => {
        const str = shorten('hey there, typescript is cool!', 27);

        expect(str).toBe('hey there, typescript is...');
    });
});
