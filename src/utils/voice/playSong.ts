import { AudioPlayer, createAudioResource, entersState, AudioPlayerStatus, StreamType } from '@discordjs/voice';

export default (player: AudioPlayer, url: string) => {
    const resource = createAudioResource(url, { inputType: StreamType.Arbitrary });

    player.play(resource);

    return entersState(player, AudioPlayerStatus.Playing, 5e3);
};
