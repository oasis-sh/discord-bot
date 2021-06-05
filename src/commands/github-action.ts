import { Interaction, MessageEmbed } from 'discord.js';
import { Command } from '@structures/Command';
import { Client } from '@structures/Client';
import { request } from '@octokit/request';

export = class GithubActionCommand extends Command {
    public constructor(client: Client) {
        super(client, {
            name: 'github-action',
            description: 'Displays the latest action run in the main repository.',
            options: [
                {
                    name: 'branch',
                    description: 'The branch to get the action.',
                    type: 'STRING',
                    required: false,
                    choices: [
                        {
                            name: 'staging',
                            value: 'staging',
                        },
                        {
                            name: 'prod',
                            value: 'prod',
                        },
                    ],
                },
            ],
        });
    }

    public async run(interaction: Interaction) {
        if (!interaction.isCommand()) return;
        interaction.defer();

        const branch = interaction.options.get('branch')?.value ?? 'staging';
        const data = (
            await request('GET /repos/{owner}/{repo}/actions/runs', {
                owner: 'oasis-sh',
                repo: 'oasis',
                branch: branch as string,
            })
        ).data.workflow_runs[0];
        const embed = new MessageEmbed()
            .setTitle(data.name)
            .setURL(data.html_url)
            .setDescription(data.head_commit.message)
            .setAuthor(data.head_commit.author.name)
            .setTimestamp(data.created_at as any)
            .addField('Branch', data.head_branch)
            .addField('Status', data.status)
            .setColor('RANDOM');

        return interaction.editReply({ embeds: [embed] });
    }
};
