import { Command, CommandOptions, Args } from '@sapphire/framework';
import { weirdToNormalChars } from 'weird-to-normal-chars';
import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
    aliases: ['norm'],
    description: "Normalizes a member's username.",
    preconditions: ['ModOnly', 'GuildOnly'],
})
export class NormalizeCommand extends Command {
    public async run(message: Message, args: Args) {
        const member = (await args.pickResult('member')).value;

        if (!member) return message.reply('You provided an invalid member.');
        if (!member.manageable) return message.reply('I cannot manage that member...');

        const oldNick = member.displayName;
        const newNick = weirdToNormalChars(oldNick);

        if (oldNick === newNick) return message.reply('The result was the same. Aborting.');

        member.setNickname(newNick, 'Normalized.');
        message.reply(`**__${oldNick}__ -> __${newNick}__**`);
    }
}
