import { PartialUser, User, MessageReaction, TextChannel, MessageEmbed } from 'discord.js';
import { Event } from '@sapphire/framework';
import extension from '@utils/extension';

export class MessageReactionAddEvent extends Event<'messageReactionAdd'> {
    public async run(reaction: MessageReaction, user: User | PartialUser) {
        if (user.partial) user = await user.fetch();
        if (reaction.partial) reaction = await reaction.fetch();
        if (reaction.message.partial) reaction.message = await reaction.message.fetch();
        if (user.bot) return;

        const { guild, id } = reaction.message;

        if (!guild) return;
        if (guild.id !== '826577772805095516') return;
        if (reaction.emoji.name === '⭐' && reaction.count! >= 2) {
            if (reaction.message.author.id === user.id) return;

            const channel = guild.channels.cache.get('853262088709341195') as TextChannel;
            const image =
                reaction.message.attachments.size > 0 ? extension(reaction.message.attachments.first()?.url!) : '';

            if (image === '' && reaction.message.cleanContent.length < 1) return;

            const embed = new MessageEmbed()
                .setColor('#f1c40f')
                .setDescription(reaction.message.cleanContent)
                .setAuthor(
                    reaction.message.author.tag,
                    reaction.message.author.displayAvatarURL({ dynamic: true }),
                    `https://discord.com/channels/826577772805095516/${channel.id}/${reaction.message.id}`,
                )
                .setFooter(`${reaction.message.id}`)
                .setImage(image)
                .setTimestamp();

            channel.send({ embeds: [embed] });
        }

        const member = await guild.members.fetch(user.id);
        const reactionRole = await this.context.client.db.reactionRole.findFirst({
            where: {
                messageID: id,
                emojiID: reaction.emoji.id ?? reaction.emoji.name!,
            },
        });

        if (!reactionRole) return;

        await member.roles.add(reactionRole.roleID);
    }
}
