import type { GuildBan, TextChannel, GuildAuditLogsEntry } from 'discord.js';
import type { Client } from '@structures/Client';
import { stripIndents } from 'common-tags';
import { Event } from '@structures/Event';

export = class GuildBanRemoveEvent extends Event {
    public constructor(client: Client) {
        super(client, 'guildBanRemove');
    }

    public async run(ban: GuildBan) {
        if (ban.partial) ban = await ban.fetch();

        const channel = this.client.channels.cache.get('850915437449314344') as TextChannel;
        const auditLogs = await ban.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_BAN_REMOVE',
            user: ban.user,
        });
        const { executor } = auditLogs.entries.first() as GuildAuditLogsEntry;

        channel.send(stripIndents`
            **__${ban.user.tag}__ was unbanned!**

            Reason: \`${ban.reason ?? 'No reason provided.'}\`
            Executor: \`${executor?.tag} (${executor?.id})\`
        `);
    }
};
