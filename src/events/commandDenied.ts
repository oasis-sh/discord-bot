import { CommandDeniedPayload, Event, UserError } from '@sapphire/framework';

export class CommandDeniedEvent extends Event<'commandDenied'> {
    public run({ context, message: content }: UserError, { message }: CommandDeniedPayload) {
        if (Reflect.get(Object(context), 'silent')) return;

        return message.reply(content);
    }
}
