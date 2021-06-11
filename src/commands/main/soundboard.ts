import { SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';
import connectToChannel from '@utils/voice/connectToChannel';
import { createAudioPlayer } from '@discordjs/voice';
import { ApplyOptions } from '@sapphire/decorators';
import { Message, VoiceChannel } from 'discord.js';
import SubCommand from '@structures/SubCommand';
import playSong from '@utils/voice/playSong';
import { promisify } from 'util';
import { join } from 'path';

const player = createAudioPlayer();
const wait = promisify(setTimeout);

@ApplyOptions<SubCommandPluginCommandOptions>({
    aliases: ['sb'],
    description: 'Plays some audio.',
    subCommands: ['cat', 'airplaneLanding', 'bell'],
    category: 'Main',
    preconditions: ['GuildOnly'],
})
export class SoundBoardCommand extends SubCommand {
    public async cat(message: Message) {
        const vc = message.member?.voice.channel;

        if (!vc) return message.reply('You need to join a voice channel to use this command!');
        if (!vc.joinable) return message.reply("I can't join your voice channel!");

        const connection = await connectToChannel(vc as VoiceChannel);

        connection.subscribe(player);
        await playSong(player, join(__dirname, '..', '..', '..', 'sounds', 'cat.mp3'));
        message.react('🔉');
        await wait(3000);
        connection.destroy();
    }

    public async airplaneLanding(message: Message) {
        const vc = message.member?.voice.channel;

        if (!vc) return message.reply('You need to join a voice channel to use this command!');
        if (!vc.joinable) return message.reply("I can't join your voice channel!");

        const connection = await connectToChannel(vc as VoiceChannel);

        connection.subscribe(player);
        await playSong(player, join(__dirname, '..', '..', '..', 'sounds', 'airplaneLanding.mp3'));
        message.react('🔉');
        await wait(16000);
        connection.destroy();
    }

    public async bell(message: Message) {
        const vc = message.member?.voice.channel;

        if (!vc) return message.reply('You need to join a voice channel to use this command!');
        if (!vc.joinable) return message.reply("I can't join your voice channel!");

        const connection = await connectToChannel(vc as VoiceChannel);

        connection.subscribe(player);
        await playSong(player, join(__dirname, '..', '..', '..', 'sounds', 'bell.mp3'));
        message.react('🔉');
        await wait(21000);
        connection.destroy();
    }
}
