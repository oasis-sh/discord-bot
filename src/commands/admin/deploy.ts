import { Command, CommandOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
    aliases: ['start'],
    description: 'Deploys the slash commands.',
    preconditions: ['AdminOnly'],
})
export class DeployCommand extends Command {
    public run(message: Message) {
        this.context.client.slashCommands.forEach(async (cmd) => {
            const data = {
                name: cmd.name,
                description: cmd.description,
                options: cmd.options,
                defaultPermission: cmd.defaultPermission,
            };

            await this.context.client.guilds.cache.get('826577772805095516')?.commands.create(data);
        });

        message.reply('Done!');
    }
}
