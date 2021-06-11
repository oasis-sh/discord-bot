import { joinVoiceChannel, entersState, VoiceConnectionStatus } from '@discordjs/voice';
import type { VoiceChannel } from 'discord.js';
import adapter from './adapter';

export default async (channel: VoiceChannel) => {
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: adapter(channel),
    });

    await entersState(connection, VoiceConnectionStatus.Ready, 30e3);

    return connection;
};
