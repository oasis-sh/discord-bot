import type { Role, TextChannel } from 'discord.js';
import { Event } from '@sapphire/framework';
import { stripIndents } from 'common-tags';

export class RoleUpdateEvent extends Event<'roleUpdate'> {
    public run(oldRole: Role, newRole: Role) {
        if (oldRole.guild.id !== '826577772805095516') return;

        const channel = this.context.client.channels.cache.get('850915437449314344') as TextChannel;

        if (oldRole.rawPosition !== newRole.rawPosition)
            channel.send(stripIndents`
                **A role's position got updated!**

                Name: \`${oldRole.name}\`
                ID: \`${oldRole.id}\`
                Old Position: \`${oldRole.rawPosition}\`
                New Position: \`${newRole.rawPosition}\`
            `);
    }
}
