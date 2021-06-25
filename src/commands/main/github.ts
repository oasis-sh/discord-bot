import { Message, MessageEmbed, APIMessage, TextChannel, Permissions } from 'discord.js';
import { SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { ApplyOptions } from '@sapphire/decorators';
import type { Args } from '@sapphire/framework';
import SubCommand from '@structures/SubCommand';
import { request } from '@octokit/request';
import trending from 'trending-github';
import shorten from '@utils/shorten';

@ApplyOptions<SubCommandPluginCommandOptions>({
    aliases: ['gh'],
    description: 'A github command.',
    subCommands: ['action', 'repo', 'user', 'issue', 'pr', 'trending'],
    category: 'Main',
    preconditions: ['GuildOnly'],
})
export class GithubCommand extends SubCommand {
    public async action(message: Message, args: Args) {
        const branch = (await args.pickResult('string')).value ?? 'staging';

        if (!['staging', 'prod'].includes(branch)) return message.reply('You provided an invalid branch.');

        const data = (
            await request('GET /repos/{owner}/{repo}/actions/runs', {
                owner: 'oasis-sh',
                repo: 'oasis',
                branch: branch,
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

        message.reply({ embeds: [embed] });
    }

    public async repo(message: Message, args: Args) {
        try {
            const owner = (await args.pickResult('string')).value as string;
            const name = await args.rest('string');
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

            message.reply({ embeds: [embed] });
        } catch (err) {
            if (err.message === 'Not Found') return message.reply("I couldn't find that repository...");
        }
    }

    public async user(message: Message, args: Args) {
        try {
            const username = (await args.pickResult('string')).value as string;
            const { data } = await request('GET /users/{username}', { username });
            if (data.type === 'User') {
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
                message.reply({ embeds: [embed] });
            } else {
                const embed = new MessageEmbed()
                .setTitle(data.login)
                .setURL(data.html_url)
                .setThumbnail(data.avatar_url)
                .setTimestamp(data.updated_at)
                .setDescription(data.bio ?? '')
                .addField('Repositories', String(data.public_repos), true)
                .setFooter('Last updated at')
                .setColor('RANDOM');
                message.reply({ embeds: [embed] });
            }

        } catch (err) {
            if (err.message === 'Not Found') return message.reply("I couldn't find that user...");
        }
    }

    public async issue(message: Message, args: Args) {
        try {
            const owner = (await args.pickResult('string')).value as string;
            const name = (await args.pickResult('string')).value as string;
            const issue_number = await args.rest('number');
            const { data } = await request('GET /repos/{owner}/{repo}/issues/{issue_number}', {
                owner,
                issue_number,
                repo: name,
            });

            if (data.pull_request) return message.reply('That is a pull request, not an issue...');

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

            message.reply({ embeds: [embed] });
        } catch (err) {
            if (err.message === 'Not Found') return message.reply("I couldn't find that issue...");
        }
    }

    public async pr(message: Message, args: Args) {
        try {
            const owner = (await args.pickResult('string')).value as string;
            const name = (await args.pickResult('string')).value as string;
            const pull_number = await args.rest('number');
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

            message.reply({ embeds: [embed] });
        } catch (err) {
            if (err.message === 'Not Found') return message.reply("I couldn't find that pull request...");
        }
    }

    public async trending(message: Message) {
        if (!message.guild?.me?.permissionsIn(message.channel).has(Permissions.FLAGS.MANAGE_MESSAGES))
            return message.reply('I need the `Manage Messages` permission for this command to work!');

        const data = await trending();

        new PaginatedMessage({
            pages: data.map(
                (item) => (index, pages) =>
                    new APIMessage(message.channel, {
                        embeds: [
                            new MessageEmbed()
                                .setTitle(item.name)
                                .setURL(item.href)
                                .setDescription(item.description ?? '')
                                .setAuthor(item.author)
                                .addField('Added Stars', String(item.starsInPeriod ?? 0))
                                .setColor('RANDOM')
                                .setFooter(`Page ${index + 1} / ${pages.length}`),
                        ],
                    }),
            ),
        }).run(message.author, message.channel as TextChannel);
    }
}
