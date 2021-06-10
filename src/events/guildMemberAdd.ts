import type { GuildMember, TextChannel } from 'discord.js';
import msgs from '@utils/constants/welcomeMessages';
import { Event } from '@sapphire/framework';

export class GuildMemberAddEvent extends Event<'guildMemberAdd'> {
    public run(member: GuildMember) {
        if (member.guild.id !== '826577772805095516') return;

        const channel = this.context.client.channels.cache.get('852154266281967706') as TextChannel;
        const message = msgs[~~(Math.random() * msgs.length)].replaceAll('{{user}}', `**${member.user.tag}**`);

        channel.send(message);
    }
}
