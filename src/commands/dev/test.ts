import { Command, CommandOptions, Args } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
    description: 'Test',
    preconditions: ['OwnerOnly'],
})
export class TestCommand extends Command {
    public async run(message: Message, args: Args) {
        console.log((await args.pickResult('emoji')).value);
        message.reply('test complete.');
    }
}
