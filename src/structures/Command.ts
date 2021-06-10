import { Command, CommandOptions, PieceContext } from '@sapphire/framework';

export default abstract class extends Command {
    public category: string;

    public constructor(context: PieceContext, { name, ...options }: CommandOptions) {
        super(context, { name, ...options });

        this.category = options.category;
    }
}
