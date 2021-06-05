import { Interaction, MessageEmbed } from 'discord.js';
import { Command } from '@structures/Command';
import { Client } from '@structures/Client';
import { request } from '@octokit/request';

export = class GithubUserCommand extends Command {
    public constructor(client: Client) {
        super(client, {
            name: 'github-user',
            description: 'Shows information about a github user.',
            options: [
                {
                    name: 'username',
                    description: 'The username of the user.',
                    type: 'STRING',
                    required: true,
                },
            ],
        });
    }

    public async run(interaction: Interaction) {
        if (!interaction.isCommand()) return;
        interaction.defer();

        try {
            const username = interaction.options.get('username')?.value as string;
            const { data } = await request('GET /users/{username}', { username });
            const embed = new MessageEmbed()
                .setTitle(data.login)
                .setURL(data.html_url)
                .setThumbnail(data.avatar_url)
                .setTimestamp(data.updated_at)
                .setDescription(data.bio ?? '')
                .addField('Repositories', String(data.public_repos), true)
                .addField('Gists', String(data.public_gists), true)
                .addField('Followers', String(data.followers), true)
                .setFooter('Last updated at')
                .setColor('RANDOM');

            interaction.editReply({ embeds: [embed] });
        } catch (err) {
            if (err.message === 'Not Found') return interaction.editReply("I couldn't find that user...");
        }
    }
};
