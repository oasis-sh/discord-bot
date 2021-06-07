import type { GuildMember, PartialGuildMember, Role, TextChannel, GuildAuditLogsEntry } from 'discord.js';
import { Event } from '@sapphire/framework';
import { stripIndents } from 'common-tags';

export class GuildMemberUpdateEvent extends Event<'guildMemberUpdate'> {
    public async run(oldMember: PartialGuildMember | GuildMember, newMember: GuildMember) {
        const channel = this.context.client.channels.cache.get('850915437449314344') as TextChannel;

        if (oldMember.partial) oldMember = await oldMember.fetch();

        const addedRoles: Role[] = [];

        newMember.roles.cache.forEach((role) => {
            if (!oldMember.roles.cache.has(role.id)) addedRoles.push(role);
        });
        addedRoles.forEach((role) => {
            channel.send(stripIndents`
                **__${oldMember.user?.tag}__ got a role added!**

                Name: \`${role.name}\`
                ID: \`${role.id}\`
                Position: \`${role.position}\`
            `);
        });

        const removedRoles: Role[] = [];

        oldMember.roles.cache.forEach((role) => {
            if (!newMember.roles.cache.has(role.id)) removedRoles.push(role);
        });
        removedRoles.forEach((role) => {
            channel.send(stripIndents`
                **__${oldMember.user?.tag}__ got a role removed...**

                Name: \`${role.name}\`
                ID: \`${role.id}\`
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
}
