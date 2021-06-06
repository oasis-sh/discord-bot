import { Event } from '@sapphire/framework';

export class WarnEvent extends Event<'warn'> {
    public run(info: string) {
        this.context.client.logger.warn(info);
    }
}
