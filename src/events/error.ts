import { Event } from '@sapphire/framework';

export class ErrorEvent extends Event<'error'> {
    public run(error: Error) {
        this.context.client.logger.error(error);
        this.context.client.captureExecption(error);
    }
}
