import { SlashCommand } from '@structures/SlashCommand';
import type { Client } from '@structures/Client';
import { Interaction } from 'discord.js';

export = class HelloCommand extends SlashCommand {
    public constructor(client: Client) {
        super(client, {
            name: 'hello',
            description: 'Says hello to you!',
        });
    }

    public async run(interaction: Interaction) {
        if (!interaction.isCommand()) return;

        return interaction.reply('Hello!', { ephemeral: true });
    }
};
