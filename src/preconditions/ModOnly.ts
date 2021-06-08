import { Precondition } from '@sapphire/framework';
import type { Message } from 'discord.js';

export default class ModOnlyPrecondition extends Precondition {
    public async run(message: Message) {
        const isAdmin =
            this.context.client.mods.includes(message.author.id) ||
            this.context.client.admins.includes(message.author.id) ||
            this.context.client.owners.includes(message.author.id);

        return isAdmin ? this.ok() : this.error({ message: "You don't have permission to run this command." });
    }
}
