import { GatewayVoiceServerUpdateDispatchData, GatewayVoiceStateUpdateDispatchData } from 'discord-api-types/v8';
import { DiscordGatewayAdapterCreator, DiscordGatewayAdapterLibraryMethods } from '@discordjs/voice';
import { VoiceChannel, Snowflake, Constants, WebSocketShard, Guild, Collection } from 'discord.js';
import { Client } from '@structures/Client';

const adapters = new Collection<Snowflake, DiscordGatewayAdapterLibraryMethods>();
const trackedClients = new Set<Client>();
const trackedGuilds = new Collection<WebSocketShard, Set<Snowflake>>();

const trackClient = (client: Client) => {
    if (trackedClients.has(client)) return;

    trackedClients.add(client);

    client.ws.on(Constants.WSEvents.VOICE_SERVER_UPDATE, (payload: GatewayVoiceServerUpdateDispatchData) =>
        adapters.get(payload.guild_id)?.onVoiceServerUpdate(payload),
    );
    client.ws.on(Constants.WSEvents.VOICE_STATE_UPDATE, (payload: GatewayVoiceStateUpdateDispatchData) => {
        if (payload.guild_id && payload.session_id && payload.user_id === client.user?.id)
            adapters.get(payload.guild_id)?.onVoiceStateUpdate(payload);
    });
};

const cleanupGuilds = (shard: WebSocketShard) => {
    const guilds = trackedGuilds.get(shard);

    if (guilds) for (const guildID of guilds.values()) adapters.get(guildID)?.destroy();
};

const trackGuild = (guild: Guild) => {
    let guilds = trackedGuilds.get(guild.shard);

    if (!guilds) {
        const cleanup = () => cleanupGuilds(guild.shard);

        guild.shard.on('close', cleanup);
        guild.shard.on('destroyed', cleanup);
        guilds = new Set();

        trackedGuilds.set(guild.shard, guilds);
    }

    guilds.add(guild.id);
};

export default (channel: VoiceChannel): DiscordGatewayAdapterCreator =>
    (methods) => {
        adapters.set(channel.guild.id, methods);

        trackClient(channel.client as Client);
        trackGuild(channel.guild);

        return {
            sendPayload(data) {
                if (channel.guild.shard.status === Constants.Status.READY) {
                    channel.guild.shard.send(data);

                    return true;
                }

                return false;
            },
            destroy() {
                return adapters.delete(channel.guild.id);
            },
        };
    };
