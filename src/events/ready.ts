import { Event } from '@sapphire/framework';

export class ReadyEvent extends Event<'ready'> {
    public run() {
        this.context.client.logger.info(`Logged in as ${this.context.client.user?.tag}!`);
    }
}
