import type { Client } from '@structures/Client';
import type { Interaction } from 'discord.js';
import { Event } from '@structures/Event';

export = class InteractionEvent extends Event {
    public constructor(client: Client) {
        super(client, 'interaction');
    }

    public async run(interaction: Interaction): Promise<void> {
        if (!interaction.isCommand()) return;

        const command = this.client.commands.get(interaction.commandName);

        await command?.run(interaction);
    }
};
