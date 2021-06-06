import { Interaction, MessageEmbed } from 'discord.js';
import type { Client } from '@structures/Client';
import { Command } from '@structures/Command';
import { request } from '@octokit/request';
import shorten from '@utils/shorten';

export = class GithubCommand extends Command {
    public constructor(client: Client) {
        super(client, {
            name: 'github',
            description: 'A github command.',
            options: [
                {
                    name: 'action',
                    description: 'Displays the latest action run in the main repository.',
                    type: 'SUB_COMMAND',
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
                },
                {
                    name: 'repo',
                    description: 'Shows information about a github repository.',
                    type: 'SUB_COMMAND',
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
                },
                {
                    name: 'user',
                    description: 'Shows information about a github user.',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'username',
                            description: 'The username of the user.',
                            type: 'STRING',
                            required: true,
                        },
                    ],
                },
                {
                    name: 'issue',
                    description: 'Shows information about a github issue.',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'owner',
                            description: 'The owner of the repository.',
                            type: 'STRING',
                            required: true,
                        },
                        {
                            name: 'name',
                            description: 'The name of the repository.',
                            type: 'STRING',
                            required: true,
                        },
                        {
                            name: 'issue_number',
                            description: 'The issue number.',
                            type: 'INTEGER',
                            required: true,
                        },
                    ],
                },
                {
                    name: 'pr',
                    description: 'Shows information about a github pull request.',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'owner',
                            description: 'The owner of the repository.',
                            type: 'STRING',
                            required: true,
                        },
                        {
                            name: 'name',
                            description: 'The name of the repository.',
                            type: 'STRING',
                            required: true,
                        },
                        {
                            name: 'pull_number',
                            description: 'The pull request number.',
                            type: 'INTEGER',
                            required: true,
                        },
                    ],
                },
            ],
        });
    }

    public async run(interaction: Interaction) {
        if (!interaction.isCommand()) return;
        interaction.defer();

        const action = interaction.options.get('action');
        const repo = interaction.options.get('repo');
        const user = interaction.options.get('user');
        const issue = interaction.options.get('issue');
        const pr = interaction.options.get('pr');

        if (action) {
            const branch = action.options?.get('branch')?.value ?? 'staging';
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

            interaction.editReply({ embeds: [embed] });
        }

        if (repo) {
            try {
                const owner = repo.options?.get('owner')?.value as string;
                const name = repo.options?.get('name')?.value as string;
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

        if (user) {
            try {
                const username = user.options?.get('username')?.value as string;
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

        if (issue) {
            try {
                const owner = issue.options?.get('owner')?.value as string;
                const name = issue.options?.get('name')?.value as string;
                const issue_number = issue.options?.get('issue_number')?.value as number;
                const { data } = await request('GET /repos/{owner}/{repo}/issues/{issue_number}', {
                    owner,
                    issue_number,
                    repo: name,
                });

                if (data.pull_request) return interaction.editReply('That is a pull request, not an issue...');

                const embed = new MessageEmbed()
                    .setTitle(`#${data.number} ${data.title}`)
                    .setDescription(shorten(data.body ?? '', 2048))
                    .setURL(data.html_url)
                    .setAuthor(data.user?.login!, data.user?.avatar_url, data.user?.html_url)
                    .setTimestamp(data.updated_at as any)
                    .setFooter('Last updated at')
                    .addField('State', data.state, true)
                    .addField('Author Association', data.author_association, true)
                    .setColor('RANDOM');

                interaction.editReply({ embeds: [embed] });
            } catch (err) {
                if (err.message === 'Not Found') return interaction.editReply("I couldn't find that issue...");

                this.client.logger.error(err);
            }
        }

        if (pr) {
            try {
                const owner = pr.options?.get('owner')?.value as string;
                const name = pr.options?.get('name')?.value as string;
                const pull_number = pr.options?.get('pull_number')?.value as number;
                const { data } = await request('GET /repos/{owner}/{repo}/pulls/{pull_number}', {
                    owner,
                    pull_number,
                    repo: name,
                });
                const embed = new MessageEmbed()
                    .setTitle(`#${data.number} ${data.title}`)
                    .setDescription(shorten(data.body ?? '', 2048))
                    .setURL(data.html_url)
                    .setAuthor(data.user?.login!, data.user?.avatar_url, data.user?.html_url)
                    .setTimestamp(data.updated_at as any)
                    .setFooter('Last updated at')
                    .addField('Additions', String(data.additions), true)
                    .addField('Deletions', String(data.deletions), true)
                    .addField('Changed Files', String(data.changed_files), true)
                    .addField('Comments', String(data.comments), true)
                    .addField('Draft', data.draft ? 'Yes' : 'No', true)
                    .addField('Mergable', data.mergeable ? 'Yes' : 'No', true)
                    .setColor('RANDOM');

                interaction.editReply({ embeds: [embed] });
            } catch (err) {
                if (err.message === 'Not Found') return interaction.editReply("I couldn't find that pull request...");

                this.client.logger.error(err);
            }
        }
    }
};
