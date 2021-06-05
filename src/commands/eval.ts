/* eslint-disable @typescript-eslint/no-unused-vars */

import parseCodeBlock from '@utils/parseCodeBlock';
import { Interaction, Util } from 'discord.js';
import { Command } from '@structures/Command';
import { Client } from '@structures/Client';
import { stripIndents } from 'common-tags';
import { Type } from '@sapphire/type';
import { inspect } from 'util';

export = class EvalCommand extends Command {
    public constructor(client: Client) {
        super(client, {
            name: 'eval',
            description: 'Executes arbitrary JavaScript code.',
            options: [
                {
                    name: 'code',
                    description: 'The code to execute.',
                    type: 'STRING',
                    required: true,
                },
            ],
        });
    }

    public async run(interaction: Interaction) {
        if (!interaction.isCommand()) return;

        interaction.defer();

        if (!this.client.owners.includes(interaction.user.id))
            return interaction.editReply("You don't have permission to run this command...");

        try {
            const { client } = this;
            const { user, member, channel, guild } = interaction;
            const script = interaction.options.get('code')?.value;
            const result = this.eval(eval(parseCodeBlock(script as string).code)); // eslint-disable-line no-eval

            interaction.editReply(result[0]);
            result.slice(1).forEach((res) => interaction.followUp(res));
        } catch (err) {
            return interaction.editReply(`Error while evaluating: ${err}`);
        }
    }

    private eval(result: any) {
        const inspected = inspect(result, { depth: 0 }).replace(this.client.token!, '--hidden--');

        return Util.splitMessage(
            stripIndents`
				**Output:**
				\`\`\`js
				${inspected}
				\`\`\`

				**Type:**
				\`\`\`ts
				${new Type(result).toString()}
				\`\`\`
			`,
            { maxLength: 1900, char: '\n' },
        );
    }
};
