import type { CanvasRenderingContext2D } from 'canvas';
import getFontSize from './getFontSize';
import measureText from './measureText';
import loadEmojis from './loadEmojis';
import split from './split';

interface RenderEmojiOptions {
    maxWidth?: number;
    emojiSideMarginPercent?: number;
    emojiTopMarginPercent?: number;
}

export default async (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    options?: RenderEmojiOptions,
) => {
    const ops = {
        maxWidth: options?.maxWidth ?? Infinity,
        emojiSideMarginPercent: options?.emojiSideMarginPercent ?? 0.1,
        emojiTopMarginPercent: options?.emojiTopMarginPercent ?? 0.1,
    };
    const textEntities = split(text);
    const fontSize = getFontSize(ctx.font);
    // @ts-ignore
    const baseLine = ctx.measureText('').alphabeticBaseline;
    const textAlign = ctx.textAlign;
    const emojiSideMargin = fontSize * ops.emojiSideMarginPercent;
    const emojiTopMargin = fontSize * ops.emojiTopMarginPercent;
    const textWidth = measureText(ctx, text, { emojiSideMarginPercent: ops.emojiSideMarginPercent }).width;
    let textLeftMargin = 0;

    if (!['', 'left', 'start'].includes(textAlign)) {
        ctx.textAlign = 'left';

        switch (textAlign) {
            case 'center':
                textLeftMargin = -textWidth / 2;

                break;
            case 'right':
            case 'end':
                textLeftMargin = -textWidth;

                break;
        }
    }

    let currentWidth = 0;

    for (let i = 0; i < textEntities.length; i++) {
        const entity = textEntities[i];

        if (typeof entity === 'string') {
            ctx.fillText(entity, textLeftMargin + x + currentWidth, y);

            currentWidth += ctx.measureText(entity).width;
        } else {
            const emoji = await loadEmojis(entity.url);

            ctx.drawImage(
                emoji!,
                textLeftMargin + x + currentWidth + emojiSideMargin,
                y + emojiTopMargin - fontSize - baseLine,
                fontSize,
                fontSize,
            );

            currentWidth += fontSize + emojiSideMargin * 2;
        }
    }
};
