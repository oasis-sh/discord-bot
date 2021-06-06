import { EventOptions, Event } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<EventOptions>({ once: true })
export class DebugEvent extends Event<'debug'> {
    public run(info: string) {
        this.context.client.logger.debug(info);
    }
}
