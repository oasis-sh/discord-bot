import { Client } from '@structures/Client';
import { Event } from '@structures/Event';

export = class DebugEvent extends Event {
    public constructor(client: Client) {
        super(client, 'debug');
    }

    public run(info: string) {
        this.client.logger.debug(info);
    }
};
