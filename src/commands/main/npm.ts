import { CommandOptions, Args } from '@sapphire/framework';
import { fetch, FetchResultTypes } from '@sapphire/fetch';
import { ApplyOptions } from '@sapphire/decorators';
import { Message, MessageEmbed } from 'discord.js';
import Command from '@structures/Command';

@ApplyOptions<CommandOptions>({
    description: 'Shows info about a NPM Package.',
    category: 'Main',
    usage: '<package>',
})
export class NPMCommand extends Command {
    public async run(message: Message, args: Args) {
        try {
            const name = (await args.pickResult('string')).value;
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

            return message.reply({ embeds: [embed] });
        } catch (err) {
            return message.reply("I couldn't find any info about that package...");
        }
    }
}
