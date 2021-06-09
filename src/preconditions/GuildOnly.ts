import { Precondition } from '@sapphire/framework';
import type { Message } from 'discord.js';

export default class GuildOnlyPrecondition extends Precondition {
    public async run(message: Message) {
        const inGuild = message.guild?.id === '826577772805095516';

        return inGuild ? this.ok() : this.error({ message: 'You must use this command inside of the Oasis Guild!' });
    }
}
