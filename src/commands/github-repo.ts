import { Interaction, MessageEmbed } from 'discord.js';
import { Command } from '@structures/Command';
import { Client } from '@structures/Client';
import { request } from '@octokit/request';

export = class GithubRepoCommand extends Command {
    public constructor(client: Client) {
        super(client, {
            name: 'github-repo',
            description: 'Shows information about a github repository.',
            options: [
                {
                    name: 'owner',
                    description: 'The owner of the repository.',
                    type: 'STRING',
                    required: true,
                },
                {
                    name: 'name',
                    description: 'The repository name.',
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
            const owner = interaction.options.get('owner')?.value as string;
            const name = interaction.options.get('name')?.value as string;
            const { data } = await request('GET /repos/{owner}/{repo}', { owner, repo: name });
            const embed = new MessageEmbed()
                .setAuthor(data.owner?.login ?? data.name, data.owner?.avatar_url, data.owner?.html_url)
                .setTitle(data.full_name)
                .setURL(data.html_url)
                .setDescription(data.description ?? 'No description.')
                .setImage(`https://opengraph.github.com/repo/${owner}/${name}`)
                .addField('Stars', String(data.stargazers_count), true)
                .addField('Forks', String(data.forks_count), true)
                .addField('Issues', String(data.open_issues_count), true)
                .addField('Watchers', String(data.watchers), true)
                .addField('License', data.license?.spdx_id ?? 'None', true)
                .addField('Language', data.language ?? 'None', true)
                .setTimestamp(data.updated_at as any)
                .setFooter('Last updated at')
                .setColor('RANDOM');

            interaction.editReply({ embeds: [embed] });
        } catch (err) {
            if (err.message === 'Not Found') return interaction.editReply("I couldn't find that repository...");
        }
    }
};
