import type { TextChannel, MessageReaction } from 'discord.js';
import { Event } from '@sapphire/framework';

interface Packet {
    t: string;
    d: Record<string, any>;
}

export class RawEvent extends Event<'raw'> {
    public async run(packet: Packet) {
        if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;

        const channel = (await this.context.client.channels.fetch(packet.d.channel_id)) as TextChannel;

        if (channel.messages.cache.has(packet.d.message_id)) return;

        const message = await channel.messages.fetch(packet.d.message_id);
        const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
        const reaction = message.reactions.cache.get(emoji) as MessageReaction;

        if (reaction as MessageReaction | undefined) {
            const user = await this.context.client.users.fetch(packet.d.user_id);

            reaction.users.cache.set(packet.d.user_id, user);
        }
        if (packet.t === 'MESSAGE_REACTION_ADD') {
            const user = await this.context.client.users.fetch(packet.d.user_id);

            this.context.client.emit('messageReactionAdd', reaction, user);
        }
        if (packet.t === 'MESSAGE_REACTION_REMOVE') {
            const user = await this.context.client.users.fetch(packet.d.user_id);

            this.context.client.emit('messageReactionRemove', reaction, user);
        }
    }
}
