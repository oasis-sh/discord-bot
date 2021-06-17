import type { CommandOptions, Args } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';
import Command from '@structures/Command';

@ApplyOptions<CommandOptions>({
    description: 'Test',
    preconditions: ['OwnerOnly', 'GuildOnly'],
    category: 'Developer',
})
export class TestCommand extends Command {
    public async run(message: Message, args: Args) {
        console.log((await args.pickResult('emoji')).value);
        message.reply('test complete.');
    }
}
