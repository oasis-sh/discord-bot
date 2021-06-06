import { Precondition } from '@sapphire/framework';
import type { Message } from 'discord.js';

export default class OwnerOnlyPrecondition extends Precondition {
    public async run(message: Message) {
        const isOwner = this.context.client.owners.includes(message.author.id);

        return isOwner ? this.ok() : this.error({ message: "You don't have permission to run this command." });
    }
}
