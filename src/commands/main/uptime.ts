import { Command, CommandOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';
import ms from '@naval-base/ms';

@ApplyOptions<CommandOptions>({
    aliases: ['up'],
    description: 'Shows the uptime of the bot.',
})
export class UptimeCommand extends Command {
    public run(message: Message) {
        const uptime = ms(this.context.client.uptime!, true);

        message.reply(`My uptime is \`${uptime}\`!`);
    }
}
