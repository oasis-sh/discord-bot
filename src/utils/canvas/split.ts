import parseDiscordEmojis from './parseDiscordEmojis';
import { parse } from 'twemoji-parser';

type Chunks = (string | { url: string })[];

export default (text: string): Chunks => {
    const twemojiEntities = parse(text, { assetType: 'png' });
    let unparsedText = text;
    let lastTwemojiIndice = 0;
    const textEntities = [];

    twemojiEntities.forEach((twemoji) => {
        textEntities.push(unparsedText.slice(0, twemoji.indices[0] - lastTwemojiIndice));
        textEntities.push(twemoji);

        unparsedText = unparsedText.slice(twemoji.indices[1] - lastTwemojiIndice);
        lastTwemojiIndice = twemoji.indices[1];
    });
    textEntities.push(unparsedText);

    return parseDiscordEmojis(textEntities);
};
