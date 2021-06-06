import type { Client } from '@structures/Client';
import { Command } from '@structures/Command';
import { Interaction } from 'discord.js';

export = class HelloCommand extends Command {
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
