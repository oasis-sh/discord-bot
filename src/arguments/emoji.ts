import { Argument, ArgumentResult, PieceContext } from '@sapphire/framework';
import { EmojiRegex } from '@sapphire/discord-utilities';

export class EmojiArgument extends Argument<`${bigint}`> {
    public constructor(context: PieceContext) {
        super(context, { name: 'emoji' });
    }

    public run(argument: string): ArgumentResult<`${bigint}`> {
        const parsed = this.parseEmoji(argument);

        if (!parsed) return this.error({ message: 'Invalid Emoji', parameter: argument });

        return this.ok(parsed as `${bigint}`);
    }

    protected parseEmoji(emoji: string) {
        const matches = EmojiRegex.exec(emoji);

        if (!matches) return null;

        return matches[3];
    }
}
