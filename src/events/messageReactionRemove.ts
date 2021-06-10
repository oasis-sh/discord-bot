import type { PartialUser, User, MessageReaction } from 'discord.js';
import { Event } from '@sapphire/framework';

export class MessageReactionRemoveEvent extends Event<'messageReactionRemove'> {
    public async run(reaction: MessageReaction, user: PartialUser | User) {
        if (user.partial) user = await user.fetch();
        if (reaction.partial) reaction = await reaction.fetch();
        if (user.bot) return;

        const { guild, id } = reaction.message;

        if (!guild) return;
        if (guild.id !== '826577772805095516') return;

        const member = await guild.members.fetch(user.id);
        const reactionRole = await this.context.client.db.reactionRole.findFirst({
            where: {
                messageID: id,
                emojiID: reaction.emoji.id!,
            },
        });

        if (!reactionRole) return;

        await member.roles.remove(reactionRole.roleID);
    }
}
