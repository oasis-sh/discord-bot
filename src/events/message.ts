import { MessagePrompter } from '@sapphire/discord.js-utilities';
import { Client } from '@structures/Client';
import { Event } from '@structures/Event';
import { Message } from 'discord.js';

export = class MessageEvent extends Event {
    public constructor(client: Client) {
        super(client, 'message');
    }

    public async run(message: Message) {
        if (!this.client.application?.owner) await this.client.application?.fetch();

        if (message.content === 'oasis deploy' && this.client.owners.includes(message.author.id)) {
            const handler = new MessagePrompter('Are you sure that you want to deploy?');
            const result = await handler.run(message.channel, message.author);

            if (result) {
                this.client.commands.forEach(async (cmd) => {
                    const data = {
                        name: cmd.name,
                        description: cmd.description,
                        options: cmd.options,
                        defaultPermission: cmd.defaultPermission,
                    };

                    await this.client.guilds.cache.get('826577772805095516')?.commands.create(data);
                });

                message.reply('Done!');
            } else message.reply('Aborted.');
        }
    }
};
