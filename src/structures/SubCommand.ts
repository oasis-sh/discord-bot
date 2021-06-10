import { SubCommandPluginCommand, SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';
import { PieceContext } from '@sapphire/framework';

export default abstract class extends SubCommandPluginCommand {
    public category: string;

    public constructor(context: PieceContext, options: SubCommandPluginCommandOptions) {
        super(context, options);

        this.category = options.category;
    }
}
