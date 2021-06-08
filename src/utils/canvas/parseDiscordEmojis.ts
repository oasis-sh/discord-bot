import { FormattedCustomEmoji } from '@sapphire/discord-utilities';

type Chunks = (string | { url: string })[];

export default (textEntities: string[]): Chunks => {
    const newTextEntities = [];

    for (const entity of textEntities) {
        if (typeof entity === 'string') {
            const words = entity.replace(new RegExp(FormattedCustomEmoji, 'g'), '\u200b$&\u200b').split('\u200b');

            for (const word of words)
                newTextEntities.push(
                    FormattedCustomEmoji.exec(word)
                        ? { url: `https://cdn.discordapp.com/emojis/${FormattedCustomEmoji.exec(word)![1]}.png` }
                        : word,
                );
        } else newTextEntities.push(entity);
    }

    return newTextEntities;
};
