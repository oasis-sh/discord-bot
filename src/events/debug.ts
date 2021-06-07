import { Event } from '@sapphire/framework';

export class DebugEvent extends Event<'debug'> {
    public run(info: string) {
        this.context.client.logger.debug(info);
    }
}
