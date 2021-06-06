import type { Client } from '@structures/Client';
import { Event } from '@structures/Event';

export = class ReadyEvent extends Event {
    public constructor(client: Client) {
        super(client, 'ready', { type: 'on' });
    }

    public run() {
        this.client.logger.info(`Logged in as ${this.client.user?.tag}!`);
    }
};
