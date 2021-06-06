import type { Message, PartialMessage, TextChannel } from 'discord.js';
import { Event } from '@sapphire/framework';
import { stripIndents } from 'common-tags';

export class MessageUpdateEvent extends Event<'messageUpdate'> {
    public async run(oldMessage: PartialMessage | Message, newMessage: PartialMessage | Message) {
        const channel = this.context.client.channels.cache.get('850915437449314344') as TextChannel;

        if (oldMessage.partial) oldMessage = await oldMessage.fetch();
        if (newMessage.partial) newMessage = await newMessage.fetch();
        if (!oldMessage.guild && !newMessage.guild) return;
        if (oldMessage.interaction && newMessage.interaction) return;

        if (oldMessage.content !== newMessage.content)
            channel.send(stripIndents`
                **A message got edited!**

                Old Content: \`${oldMessage.content}\`
                New Content: \`${newMessage.content}\`
                Link: https://discord.com/channels/826577772805095516/${newMessage.channel.id}/${newMessage.id}
            `);
    }
}
