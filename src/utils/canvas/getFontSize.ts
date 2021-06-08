export default (font: string): number => {
    if (typeof font !== 'string') return 16;

    const sizeFamily = /([0-9.]+)(px|pt|pc|in|cm|mm|%|em|ex|ch|rem|q)/.exec(font);

    if (sizeFamily?.length !== 3) return 16;

    switch (sizeFamily[2]) {
        case 'pt':
            return Number(sizeFamily[1]) / 0.75;
        case 'pc':
            return Number(sizeFamily[1]) * 16;
        case 'in':
            return Number(sizeFamily[1]) * 96;
        case 'cm':
            return Number(sizeFamily[1]) * (96 / 2.54);
        case 'mm':
            return Number(sizeFamily[1]) * (96 / 25.4);
        case '%':
            return Number(sizeFamily[1]) * (16 / 100 / 0.75);
        case 'em':
        case 'rem':
            return Number(sizeFamily[1]) * (16 / 0.75);
        case 'q':
            return Number(sizeFamily[1]) * (96 / 25.4 / 4);
        case 'px':
        default:
            return Number(sizeFamily[1]);
    }
};
