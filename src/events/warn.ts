import { Client } from '@structures/Client';
import { Event } from '@structures/Event';

export = class WarnEvent extends Event {
    public constructor(client: Client) {
        super(client, 'warn');
    }

    public run(info: string) {
        this.client.logger.warn(info);
    }
};
