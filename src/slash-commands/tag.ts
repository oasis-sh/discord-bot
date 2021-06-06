import { SlashCommand } from '@structures/SlashCommand';
import { Interaction, MessageEmbed } from 'discord.js';
import type { Client } from '@structures/Client';

export default class TagCommand extends SlashCommand {
    public constructor(client: Client) {
        super(client, {
            name: 'tag',
            description: 'Shows a tag.',
            options: [
                {
                    name: 'show',
                    description: 'Shows a tag.',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'name',
                            description: 'The name of the tag.',
                            type: 'STRING',
                            required: true,
                        },
                    ],
                },
                {
                    name: 'create',
                    description: 'Creates a new tag.',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'name',
                            description: 'The name of the new tag.',
                            type: 'STRING',
                            required: true,
                        },
                        {
                            name: 'content',
                            description: 'The content of the new tag.',
                            type: 'STRING',
                            required: true,
                        },
                    ],
                },
                {
                    name: 'del',
                    description: 'Deletes an existing tag.',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'name',
                            description: 'The name of the tag.',
                            type: 'STRING',
                            required: true,
                        },
                    ],
                },
                {
                    name: 'edit',
                    description: 'Edits an existing tag.',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'name',
                            description: 'The name of the tag.',
                            type: 'STRING',
                            required: true,
                        },
                        {
                            name: 'content',
                            description: 'The new content of the tag.',
                            type: 'STRING',
                            required: true,
                        },
                    ],
                },
                {
                    name: 'info',
                    description: 'Shows information about a specific tag.',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'name',
                            description: 'The name of the tag.',
                            type: 'STRING',
                            required: true,
                        },
                    ],
                },
                {
                    name: 'list',
                    description: 'Lists all the tags.',
                    type: 'SUB_COMMAND',
                },
            ],
        });
    }

    public async run(interaction: Interaction) {
        if (!interaction.isCommand()) return;
        interaction.defer();

        const show = interaction.options.get('show');
        const create = interaction.options.get('create');
        const del = interaction.options.get('del');
        const edit = interaction.options.get('edit');
        const info = interaction.options.get('info');
        const list = interaction.options.get('list');

        if (show) {
            const data = await this.client.db.tag.findUnique({
                where: {
                    name: show.options?.get('name')?.value as string,
                },
            });

            if (!data) return interaction.editReply("That tag doesn't exist...");

            interaction.editReply(data.content);
        }

        if (create) {
            if (!this.client.owners.includes(interaction.user.id))
                return interaction.editReply("You don't have permission to run this command...");

            const name = create.options?.get('name')?.value as string;
            const content = create.options?.get('content')?.value as string;
            const isExisting = await this.client.db.tag.findUnique({ where: { name } });

            if (isExisting) return interaction.editReply('That tag already exists...');

            await this.client.db.tag.create({
                data: {
                    content,
                    name,
                    ownerID: interaction.user.id,
                    ownerName: interaction.user.username,
                },
            });

            interaction.editReply(`Tag **${name}** was created successfully!`);
        }

        if (del) {
            if (!this.client.owners.includes(interaction.user.id))
                return interaction.editReply("You don't have permission to run this command...");

            const name = del.options?.get('name')?.value as string;
            const isExisting = await this.client.db.tag.findUnique({ where: { name } });

            if (!isExisting) return interaction.editReply("That tag doesn't exist...");

            await this.client.db.tag.delete({ where: { name } });

            interaction.editReply(`Tag **${name}** was deleted successfully!`);
        }

        if (edit) {
            if (!this.client.owners.includes(interaction.user.id))
                return interaction.editReply("You don't have permission to run this command...");

            const name = edit.options?.get('name')?.value as string;
            const content = edit.options?.get('content')?.value as string;
            const isExisting = await this.client.db.tag.findUnique({ where: { name } });

            if (!isExisting) return interaction.editReply("That tag doesn't exist...");

            await this.client.db.tag.update({
                where: { name },
                data: { content },
            });

            interaction.editReply(`Tag **${name}** was edited successfully with new content \`${content}\`!`);
        }

        if (info) {
            const name = info.options?.get('name')?.value as string;
            const data = await this.client.db.tag.findUnique({ where: { name } });

            if (!data) return interaction.editReply("That tag doesn't exist...");

            const owner = await this.client.users.fetch(data.ownerID as `${bigint}`);
            const embed = new MessageEmbed()
                .setTitle(`**Tag __${data.name}__**`)
                .setThumbnail(owner.displayAvatarURL({ dynamic: true }))
                .setDescription(data.content)
                .setTimestamp(data.createdAt)
                .setColor('RANDOM');

            interaction.editReply({ embeds: [embed] });
        }

        if (list) {
            const tags = await this.client.db.tag.findMany();
            let content = '';

            for (const tag of tags) {
                const user = await this.client.users.fetch(tag.ownerID as `${bigint}`);

                content += `**\`${tag.name}\`** - \`${user.tag}\`\n`;
            }

            interaction.editReply(content || 'No tags.');
        }
    }
}
