import { Message, TextChannel, PartialMessage } from 'discord.js';
import { Event } from '@sapphire/framework';
import { stripIndents } from 'common-tags';

export class MessageDeleteEvent extends Event<'messageDelete'> {
    public async run(message: Message | PartialMessage) {
        if (!message.guild) return;
        if (message.partial) message = await message.fetch();
        if (message.guild?.id !== '826577772805095516') return;

        const channel = this.context.client.channels.cache.get('850915437449314344') as TextChannel;

        channel.send(stripIndents`
            **A message got deleted...**

            Content: \`${message.content}\`
            ID: \`${message.id}\`
            Author: \`${message.author.tag} (${message.author.id})\`
            Channel: <#${message.channel.id}>
        `);
    }
}
