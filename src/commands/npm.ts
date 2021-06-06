import { fetch, FetchResultTypes } from '@sapphire/fetch';
import { Interaction, MessageEmbed } from 'discord.js';
import type { Client } from '@structures/Client';
import { Command } from '@structures/Command';

export = class NPMCommand extends Command {
    public constructor(client: Client) {
        super(client, {
            name: 'npm',
            description: 'Shows information about an npm package.',
            options: [
                {
                    name: 'package',
                    description: 'The package name.',
                    type: 'STRING',
                    required: true,
                },
            ],
        });
    }

    public async run(interaction: Interaction) {
        if (!interaction.isCommand()) return;

        try {
            interaction.defer();

            const name = interaction.options.get('package')?.value;
            const data = await fetch<any>(`https://registry.npmjs.com/${name as string}`, FetchResultTypes.JSON);

            const version = data.versions[data['dist-tags'].latest];
            const embed = new MessageEmbed()
                .setTitle(data.name)
                .setThumbnail('https://i.imgur.com/mwbIjU4.png')
                .setTimestamp(data.time.modified)
                .setURL(`https://npm.im/${data._id}`)
                .addField(
                    'Package Info',
                    [
                        `**Author:** ${version.maintainers[0].name ?? 'None'}`,
                        `**Repository:** ${data.repository?.url.replace('git+', '') ?? 'None'}`,
                        `** ${version.maintainers.length > 1 ? 'Maintainers' : 'Maintainer'}:** ${version.maintainers
                            .map(({ name }: { name: string }) => name)
                            .join(', ')}`,
                        `** Latest Version:** ${version.version || 'None'}`,
                        `** Keywords:** ${data.keywords ? data.keywords.join(', ') : 'None'}`,
                    ].join('\n'),
                )
                .setColor('RANDOM');

            if (data.description) embed.setDescription(data.description);

            return interaction.editReply({ embeds: [embed] });
        } catch (err) {
            this.client.logger.error(err);

            return interaction.editReply("I couldn't find any info about that package...");
        }
    }
};
