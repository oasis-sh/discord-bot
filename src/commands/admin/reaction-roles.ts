import { SubCommandPluginCommand, SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';
import { ApplyOptions } from '@sapphire/decorators';
import type { Args } from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<SubCommandPluginCommandOptions>({
    description: "Set's up reaction roles.",
    aliases: ['rr'],
    preconditions: ['AdminOnly', 'GuildOnly'],
    subCommands: ['add', 'remove'],
})
export class ReactionRolesCommand extends SubCommandPluginCommand {
    public async add(message: Message, args: Args) {
        const channel = (await args.pickResult('textChannel')).value;
        const emoji = (await args.pickResult('emoji')).value;
        const role = (await args.pickResult('role')).value;
        const messageID = (await args.rest('string')) as `${bigint}`;

        if (!channel) return message.reply('You provided an invalid channel.');
        if (!emoji) return message.reply('You provided an invalid emoji.');
        if (!role) return message.reply('You provided an invalid role.');

        let msg: Message;

        try {
            msg = await channel.messages.fetch(messageID);
        } catch {
            return message.reply('You provided an invalid message id.');
        }

        const identifier = message.guild?.emojis.cache.get(emoji)?.identifier;
        const exists = await this.context.client.db.reactionRole.findFirst({
            where: {
                messageID,
                emojiID: emoji,
            },
        });

        if (exists) return message.reply(`A reaction role for the emoji **${identifier}** already exists.`);

        await this.context.client.db.reactionRole.create({
            data: {
                messageID,
                emojiID: emoji,
                roleID: role.id,
            },
        });
        await msg.react(identifier!);

        message.reply('Creating the reaction role was a success!');
    }

    public async remove(message: Message, args: Args) {
        const channel = (await args.pickResult('textChannel')).value;
        const emoji = (await args.pickResult('emoji')).value;
        const messageID = await args.rest('string');

        if (!channel) return message.reply('You provided an invalid channel.');
        if (!emoji) return message.reply('You provided an invalid emoji.');

        let msg: Message;

        try {
            msg = await channel.messages.fetch(messageID as `${bigint}`);
        } catch {
            return message.reply('You provided an invalid message id.');
        }

        const identifier = message.guild?.emojis.cache.get(emoji)?.identifier;
        const exists = await this.context.client.db.reactionRole.findFirst({
            where: {
                messageID,
                emojiID: emoji,
            },
        });

        if (!exists) return message.reply(`A reaction role for the emoji **${identifier}** doesnt exist.`);

        await msg.reactions.cache.get(emoji)?.remove();
        await this.context.client.db.reactionRole.delete({ where: { id_messageID: { id: exists.id, messageID } } });

        message.reply('Removing the reaction role was a success!');
    }
}
