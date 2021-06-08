import type { CanvasRenderingContext2D } from 'canvas';
import getFontSize from './getFontSize';
import split from './split';

interface MeasureTextData {
    width: number;
    alphabeticBaseline: number;
}

export default (ctx: CanvasRenderingContext2D, text: string, { emojiSideMarginPercent = 0.1 }): MeasureTextData => {
    const textEntities = split(text);
    const fontSize = getFontSize(ctx.font);
    const emojiSideMargin = fontSize * emojiSideMarginPercent;
    let currentWidth = 0;

    for (let i = 0; i < textEntities.length; i++) {
        const entity = textEntities[i];

        if (typeof entity === 'string') currentWidth += ctx.measureText(entity).width;
        else currentWidth += fontSize + emojiSideMargin * 2;
    }

    const measured = ctx.measureText('');

    return {
        width: currentWidth,
        // @ts-ignore
        alphabeticBaseline: measured.alphabeticBaseline,
    };
};
