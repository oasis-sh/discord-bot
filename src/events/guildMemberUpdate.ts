import type { GuildMember, PartialGuildMember, Role, TextChannel, GuildAuditLogsEntry } from 'discord.js';
import type { Client } from '@structures/Client';
import { stripIndents } from 'common-tags';
import { Event } from '@structures/Event';

export = class GuildMemberUpdateEvent extends Event {
    public constructor(client: Client) {
        super(client, 'guildMemberUpdate');
    }

    public async run(oldMember: PartialGuildMember | GuildMember, newMember: GuildMember) {
        const channel = this.client.channels.cache.get('850915437449314344') as TextChannel;

        if (oldMember.partial) oldMember = await oldMember.fetch();

        const addedRoles: Role[] = [];

        newMember.roles.cache.forEach((role) => {
            if (!oldMember.roles.cache.has(role.id)) addedRoles.push(role);
        });
        addedRoles.forEach(async (role) => {
            const auditLogs = await oldMember.guild.fetchAuditLogs({
                limit: 1,
                type: 'MEMBER_ROLE_UPDATE',
                user: oldMember.user!,
            });
            const { executor } = auditLogs.entries.first() as GuildAuditLogsEntry;

            channel.send(stripIndents`
                **__${oldMember.user?.tag}__ got a role added!**

                Name: \`${role.name}\`
                ID: \`${role.id}\`
                Position: \`${role.position}\`
                Executor: \`${executor?.tag} (${executor?.id})\`
            `);
        });

        const removedRoles: Role[] = [];

        oldMember.roles.cache.forEach((role) => {
            if (!newMember.roles.cache.has(role.id)) removedRoles.push(role);
        });
        removedRoles.forEach(async (role) => {
            const auditLogs = await oldMember.guild.fetchAuditLogs({
                limit: 1,
                type: 'MEMBER_ROLE_UPDATE',
                user: oldMember.user!,
            });
            const { executor } = auditLogs.entries.first() as GuildAuditLogsEntry;

            channel.send(stripIndents`
                **__${oldMember.user?.tag}__ got a role removed...**

                Name: \`${role.name}\`
                ID: \`${role.id}\`
                Executor: \`${executor?.tag} (${executor?.id})\`
            `);
        });

        if (oldMember.nickname !== newMember.nickname) {
            const auditLogs = await oldMember.guild.fetchAuditLogs({
                limit: 1,
                type: 'MEMBER_UPDATE',
                user: oldMember.user,
            });
            const { executor } = auditLogs.entries.first() as GuildAuditLogsEntry;

            channel.send(stripIndents`
                **__${oldMember.user.tag}'s__ nickname changed!**

                Old Nickname: \`${oldMember.nickname ?? 'None'}\`
                New Nickname: \`${newMember.nickname ?? 'None'}\`
                Executor: \`${executor?.tag} (${executor?.id})\`
            `);
        }
    }
};
