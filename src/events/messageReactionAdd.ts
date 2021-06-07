import type { PartialUser, User, MessageReaction } from 'discord.js';
import { Event } from '@sapphire/framework';

export class MessageReactionAddEvent extends Event<'messageReactionAdd'> {
    public async run(reaction: MessageReaction, user: User | PartialUser) {
        if (user.partial) user = await user.fetch();
        if (reaction.partial) reaction = await reaction.fetch();
        if (user.bot) return;

        const { guild, id } = reaction.message;

        if (!guild) return;

        const member = await guild.members.fetch(user.id);
        const reactionRole = await this.context.client.db.reactionRole.findFirst({
            where: {
                messageID: id,
                emojiID: reaction.emoji.id!,
            },
        });

        if (!reactionRole) return;

        await member.roles.add(reactionRole.roleID);
    }
}
