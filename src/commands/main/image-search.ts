import { Message, MessageEmbed, Permissions, APIMessage, TextChannel } from 'discord.js';
import { CommandOptions, Args, PermissionsPrecondition } from '@sapphire/framework';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import type SearchResponse from '@utils/types/googleSearch';
import { fetch, FetchResultTypes } from '@sapphire/fetch';
import { ApplyOptions } from '@sapphire/decorators';
import Command from '@structures/Command';

@ApplyOptions<CommandOptions>({
    aliases: ['image-sr'],
    description: 'Searches google images for your query.',
    category: 'Main',
    usage: '<query>',
    preconditions: [
        {
            name: 'Cooldown',
            context: {
                limit: 3,
                delay: 15000,
            },
        },
        new PermissionsPrecondition(Permissions.FLAGS.MANAGE_MESSAGES),
    ],
})
export class ImageSearchCommand extends Command {
    public async run(message: Message, args: Args) {
        const query = await args.rest('string');
        const data = await fetch<SearchResponse>(
            `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_KEY}&cx=${process.env.CUSTOM_SEARCH_ID}&safe=active&q=${query}&searchType=image`,
            FetchResultTypes.JSON,
        );

        if (!data.items) return message.reply("Couldn't find any results.");

        new PaginatedMessage({
            pages: [...data.items.values()].map(
                (item) => (index, pages) =>
                    new APIMessage(message.channel, {
                        embeds: [
                            new MessageEmbed()
                                .setTitle(item.title)
                                .setImage(item.link)
                                .setColor('RANDOM')
                                .setFooter(`Page ${index + 1} / ${pages.length}`),
                        ],
                    }),
            ),
        }).run(message.author, message.channel as TextChannel);
    }
}
