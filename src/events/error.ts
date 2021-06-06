import type { Client } from '@structures/Client';
import { Event } from '@structures/Event';

export = class ErrorEvent extends Event {
    public constructor(client: Client) {
        super(client, 'error');
    }

    public run(error: Error) {
        this.client.logger.error(error);
    }
};
