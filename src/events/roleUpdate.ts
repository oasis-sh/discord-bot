import type { Role, TextChannel } from 'discord.js';
import type { Client } from '@structures/Client';
import { stripIndents } from 'common-tags';
import { Event } from '@structures/Event';

export = class RoleUpdateEvent extends Event {
    public constructor(client: Client) {
        super(client, 'roleUpdate');
    }

    public run(oldRole: Role, newRole: Role) {
        const channel = this.client.channels.cache.get('850915437449314344') as TextChannel;

        if (oldRole.rawPosition !== newRole.rawPosition)
            channel.send(stripIndents`
                **A role's position got updated!**

                Name: \`${oldRole.name}\`
                ID: \`${oldRole.id}\`
                Old Position: \`${oldRole.rawPosition}\`
                New Position: \`${newRole.rawPosition}\`
            `);
    }
};
