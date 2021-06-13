import { SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';
import { ApplyOptions } from '@sapphire/decorators';
import { Message, MessageEmbed } from 'discord.js';
import type { Args } from '@sapphire/framework';
import SubCommand from '@structures/SubCommand';

@ApplyOptions<SubCommandPluginCommandOptions>({
    aliases: ['t'],
    description: 'A subcommand of tag commands.',
    subCommands: ['show', 'create', 'del', 'edit', 'info', 'list'],
    preconditions: ['GuildOnly'],
    category: 'Admin',
})
export class TagCommand extends SubCommand {
    public async show(message: Message, args: Args) {
        const name = (await args.pickResult('string')).value;
        const data = await this.context.client.db.tag.findUnique({ where: { name } });

        if (!data) return message.reply("That tag doesn't exist...");

        message.reply(data.content);
    }

    public async create(message: Message, args: Args) {
        if (!this.context.client.admins.includes(message.author.id))
            return message.reply("You don't have permission to run this command...");

        const name = (await args.pickResult('string')).value as string;
        const content = await args.rest('string');
        const isExisting = await this.context.client.db.tag.findUnique({ where: { name } });

        if (isExisting) return message.reply('That tag already exists...');

        await this.context.client.db.tag.create({
            data: {
                content,
                name,
                ownerID: message.author.id,
                ownerName: message.author.username,
            },
        });

        message.reply(`Tag **${name}** was created successfully!`);
    }

    public async del(message: Message, args: Args) {
        if (!this.context.client.admins.includes(message.author.id))
            return message.reply("You don't have permission to run this command...");

        const name = (await args.pickResult('string')).value as string;
        const isExisting = await this.context.client.db.tag.findUnique({ where: { name } });

        if (!isExisting) return message.reply("That tag doesn't exist...");

        await this.context.client.db.tag.delete({ where: { name } });

        message.reply(`Tag **${name}** was deleted successfully!`);
    }

    public async edit(message: Message, args: Args) {
        if (!this.context.client.admins.includes(message.author.id))
            return message.reply("You don't have permission to run this command...");

        const name = (await args.pickResult('string')).value as string;
        const content = await args.rest('string');
        const isExisting = await this.context.client.db.tag.findUnique({ where: { name } });

        if (!isExisting) return message.reply("That tag doesn't exist...");

        await this.context.client.db.tag.update({
            where: { name },
            data: { content },
        });

        message.reply(`Tag **${name}** was edited successfully with new content \`${content}\`!`);
    }

    public async info(message: Message, args: Args) {
        const name = (await args.pickResult('string')).value as string;
        const data = await this.context.client.db.tag.findUnique({ where: { name } });

        if (!data) return message.reply("That tag doesn't exist...");

        const owner = await this.context.client.users.fetch(data.ownerID as `${bigint}`);
        const embed = new MessageEmbed()
            .setTitle(`**Tag __${data.name}__**`)
            .setThumbnail(owner.displayAvatarURL({ dynamic: true }))
            .setDescription(data.content)
            .setTimestamp(data.createdAt)
            .setColor('RANDOM');

        message.reply({ embeds: [embed] });
    }

    public async list(message: Message) {
        const tags = await this.context.client.db.tag.findMany();
        let content = '';

        for (const tag of tags) {
            const user = await this.context.client.users.fetch(tag.ownerID as `${bigint}`);

            content += `**\`${tag.name}\`** - \`${user.tag}\`\n`;
        }

        message.reply(content || 'No tags.');
    }
}
