import parseCodeBlock from '../src/utils/parseCodeBlock';

describe('test parsing codeblocks', () => {
    it('should return the same value', () => {
        const base = 'Hello World!';
        const parsed = parseCodeBlock(base);

        expect(parsed).toEqual({ code: base, lang: null });
    });

    it('should return the same value but with a codeblock', () => {
        const base = '```\nhi there\n```';
        const parsed = parseCodeBlock(base);

        expect(parsed).toEqual({ code: 'hi there', lang: null });
    });

    it('should parse the codeblock', () => {
        const base = '```js\nconsole.log("Hello, World!");\n```';
        const parsed = parseCodeBlock(base);

        expect(parsed).toEqual({ code: 'console.log("Hello, World!");', lang: 'js' });
    });
});
