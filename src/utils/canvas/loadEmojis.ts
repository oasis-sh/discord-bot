import { Image, loadImage } from 'canvas';
import { Collection } from 'discord.js';

const emojiCache = new Collection<string, Image>();

export default async (url: string) => {
    if (emojiCache.has(url)) return emojiCache.get(url);

    const image = await loadImage(url);

    if (!url.includes('cdn.discordapp.com')) emojiCache.set(url, image);

    return image;
};
