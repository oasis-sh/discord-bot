import type { Interaction } from 'discord.js';
import { Event } from '@sapphire/framework';

export class InteractionEvent extends Event<'interaction'> {
    public async run(interaction: Interaction): Promise<void> {
        if (!interaction.isCommand()) return;

        const command = this.context.client.slashCommands.get(interaction.commandName);

        await command?.run(interaction);
    }
}
