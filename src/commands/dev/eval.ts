/* eslint-disable @typescript-eslint/no-unused-vars */

import { Args, Command, CommandOptions } from '@sapphire/framework';
import { codeBlock, isThenable } from '@sapphire/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';
import { Type } from '@sapphire/type';
import { inspect } from 'util';

@ApplyOptions<CommandOptions>({
    aliases: ['ev', 'debug'],
    description: 'Evaluates javascript code.',
    quotes: [],
    preconditions: ['OwnerOnly'],
    strategyOptions: {
        flags: ['async', 'hidden', 'showHidden', 'silent', 's'],
        options: ['depth'],
    },
})
export class EvalCommand extends Command {
    public async run(message: Message, args: Args) {
        const code = await args.rest('string');

        const { result, success, type } = await this.eval(code, {
            message,
            async: args.getFlags('async'),
            depth: Number(args.getOption('depth') ?? 0),
            showHidden: args.getFlags('hidden', 'showHidden'),
        });

        const output = success ? codeBlock('js', result) : `**ERROR**: ${codeBlock('bash', result)}`;

        if (args.getFlags('silent', 's')) return null;

        const typeFooter = `**Type**: ${codeBlock('typescript', type)}`;

        if (output.length > 2000) {
            return message.channel.send(`Output was too long... sent the result as a file.\n\n${typeFooter}`, {
                files: [{ attachment: Buffer.from(output), name: 'output.txt' }],
            });
        }

        return message.channel.send(`${output}\n${typeFooter}`);
    }

    private async eval(code: string, flags: { async: boolean; depth: number; showHidden: boolean; message: Message }) {
        if (flags.async) code = `(async () => {\n${code}\n})();`;

        let success = true;
        let result = null;
        const { message } = flags;
        const { client } = this.context;

        try {
            // eslint-disable-next-line no-eval
            result = eval(code);
        } catch (error) {
            if (error?.stack) {
                this.context.client.logger.error(error);
            }

            result = error;
            success = false;
        }

        const type = new Type(result).toString();

        if (isThenable(result)) result = await result;
        if (typeof result !== 'string') {
            result = inspect(result, {
                depth: flags.depth,
                showHidden: flags.showHidden,
            });
        }

        return { result, success, type };
    }
}
