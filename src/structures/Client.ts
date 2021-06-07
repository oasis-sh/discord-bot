import { LogLevel, SapphireClient, SapphireClientOptions } from '@sapphire/framework';
import { Intents, Collection } from 'discord.js';
import { PrismaClient } from '@prisma/client';
import { SlashCommand } from './SlashCommand';
import { dirname, sep } from 'path';
import { promisify } from 'util';
import Glob from 'glob';

const glob = promisify(Glob);

declare module '@sapphire/framework' {
    interface SapphireClient {
        db: PrismaClient;
        slashCommands: Collection<string, SlashCommand>;
        owners: string[];
        admins: string[];
    }

    interface ArgType {
        emoji: `${bigint}`;
    }
}

export class Client extends SapphireClient {
    public readonly db = new PrismaClient();
    public readonly slashCommands = new Collection<string, SlashCommand>();
    public readonly owners = ['566155739652030465'];
    public readonly admins = [
        '683579862526722049',
        '566155739652030465',
        '414459528998813736',
        '822545100118818827',
        '788455517202677761',
        '576580130344927243',
        '576580130344927243',
    ];

    public constructor(options?: SapphireClientOptions) {
        super({
            ...options,
            defaultPrefix: 'oasis ',
            regexPrefix: /^(hey +)?oasis[,! ]/i,
            caseInsensitiveCommands: true,
            logger: {
                level: LogLevel.Trace,
            },
            intents: [Intents.NON_PRIVILEGED, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS],
            partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER'],
            presence: {
                activities: [
                    {
                        name: 'Oasis go to the moon!',
                        type: 'WATCHING',
                    },
                ],
                status: 'online',
            },
            allowedMentions: {
                repliedUser: false,
                parse: ['roles', 'users'],
            },
        });
    }

    public get directory() {
        return `${dirname(require.main?.filename!)}${sep}`;
    }

    public async login(token = process.env.DISCORD_TOKEN) {
        await this.loadSlashCommands();

        return super.login(token);
    }

    public async loadSlashCommands() {
        const commands = await glob(`${this.directory}slash-commands/**/*.js`);

        for (const commandFile of commands) {
            delete require.cache[commandFile];

            const File = require(commandFile).default;
            const command = new File(this) as SlashCommand;

            this.logger.info(`Loaded command: ${command.name}`);
            this.slashCommands.set(command.name, command);
        }
    }
}
