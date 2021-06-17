import type { CommandOptions, Args } from '@sapphire/framework';
import type { Message, TextChannel } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import Command from '@structures/Command';

@ApplyOptions<CommandOptions>({
    aliases: ['stat'],
    description: 'Sets the current status of the website.',
    category: 'Moderation',
    usage: '<message>',
    preconditions: ['ModOnly'],
})
export class StatusCommand extends Command {
    public async run(message: Message, args: Args) {
        const content = await args.rest('string');
        const channel = (await this.context.client.channels.fetch('851522500201807902')) as TextChannel;
        const msg = (await channel.messages.fetch({ limit: 2 })).first();

        if (msg?.author.id === this.context.client.user?.id) msg?.edit(content);
        else channel.send(content);

        message.react('✅');
    }
}
