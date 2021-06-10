import '@skyra/editable-commands';

import { LogLevel, SapphireClient, SapphireClientOptions } from '@sapphire/framework';
import { PrismaClient } from '@prisma/client';
import { Intents } from 'discord.js';

declare module '@sapphire/framework' {
    interface SapphireClient {
        db: PrismaClient;
        owners: string[];
        admins: string[];
        mods: string[];
    }

    interface ArgType {
        emoji: `${bigint}`;
    }

    interface CommandOptions {
        category: string;
        usage?: string;
    }

    interface Command {
        category: string;
        usage?: string;
    }
}

export class Client extends SapphireClient {
    public readonly db = new PrismaClient();
    public readonly owners = ['566155739652030465']; // Tomio#1265

    public readonly admins = [
        '822545100118818827', // bereket#9999
        '414459528998813736', // Syntax#7041
        '162203541006450688', // SamJakob#1079
        '788455517202677761', // F1shNotFound#5117
        '576580130344927243', // Anonymouse#5776
        '683579862526722049', // Angshu31#4021
        '566155739652030465', // Tomio#1265
    ];

    public readonly mods = [
        '637745537369767936', // albert#8838
        '196252989076275200', // TheHackerCoding#0720
        '424213584659218445', // im a book#5877
        '358778308747460610', // Matt_Lawz#2170
        '538009668035805195', // PatAPizza#1536
        '566155739652030465', // Tomio#1265
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

    public async login(token = process.env.DISCORD_TOKEN) {
        return super.login(token);
    }
}
