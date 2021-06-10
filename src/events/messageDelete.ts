import type { Message, TextChannel, GuildAuditLogsEntry } from 'discord.js';
import { Event } from '@sapphire/framework';
import { stripIndents } from 'common-tags';

export class MessageDeleteEvent extends Event<'messageDelete'> {
    public async run(message: Message) {
        if (!message.guild) return;
        if (message.guild.id !== '826577772805095516') return;

        const channel = this.context.client.channels.cache.get('850915437449314344') as TextChannel;
        const auditLogs = await message.guild.fetchAuditLogs({
            limit: 1,
            type: 'MESSAGE_DELETE',
        });
        let { executor, target } = auditLogs.entries.first() as GuildAuditLogsEntry;

        if ((target as Message).id !== message.id) executor = null;

        channel.send(stripIndents`
            **A message got deleted...**

            Content: \`${message.content}\`
            ID: \`${message.id}\`
            Executor: \`${executor ? `${executor.tag} (${executor.id})` : 'Unknown'}\`
            Author: \`${message.author.tag} (${message.author.id})\`
            Channel: <#${message.channel.id}>
        `);
    }
}
