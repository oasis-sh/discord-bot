import extension from '../src/utils/extension';

describe('test the extension function', () => {
    it('should return the link', () => {
        const base = 'https://cdn.discordapp.com/attachments/846009284411129866/854174836958953482/charcoal.png';
        const res = extension(base);

        expect(res).toBe(base);
    });

    it("shouldn't return the link", () => {
        const res = extension('abcd');

        expect(res).toBe('');
    });
});
