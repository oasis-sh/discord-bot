import type { CommandOptions, Args } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';
import Command from '@structures/Command';
import { evaluate } from 'mathjs';

@ApplyOptions<CommandOptions>({
    aliases: ['solve'],
    description: 'Solves a math expression.',
    category: 'Main',
    usage: '<expression>',
})
export class MathCommand extends Command {
    public async run(message: Message, args: Args) {
        try {
            const expression = await args.rest('string');
            const result = evaluate(expression);

            message.reply(String(result));
        } catch {
            message.reply('Invalid expression.');
        }
    }
}
