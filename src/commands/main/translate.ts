import type { CommandOptions, Args } from '@sapphire/framework';
import translate from '@vitalets/google-translate-api';
import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';
import Command from '@structures/Command';
import shorten from '@utils/shorten';

@ApplyOptions<CommandOptions>({
    aliases: ['trans'],
    description: 'Translates text.',
    category: 'Main',
    usage: '<text> [--to=<lang>]',
    strategyOptions: {
        options: ['to'],
    },
    preconditions: [
        {
            name: 'Cooldown',
            context: {
                limit: 3,
                delay: 15000,
            },
        },
    ],
})
export class MathCommand extends Command {
    public async run(message: Message, args: Args) {
        try {
            const text = await args.rest('string');
            const to = args.getOption('to') ?? 'en';
            const res = await translate(text, { to });

            message.reply(shorten(res.text));
        } catch {
            message.reply('That language is not supported.');
        }
    }
}
