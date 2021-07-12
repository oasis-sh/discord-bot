/* eslint-disable @typescript-eslint/no-unused-vars */

import { Args, CommandOptions } from '@sapphire/framework';
import { codeBlock, isThenable } from '@sapphire/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';
import Command from '@structures/Command';
import { Type } from '@sapphire/type';
import { inspect } from 'util';

@ApplyOptions<CommandOptions>({
    aliases: ['ev', 'debug'],
    description: 'Evaluates javascript code.',
    quotes: [],
    category: 'Developer',
    usage: '<script>',
    preconditions: ['OwnerOnly'],
    strategyOptions: {
        flags: ['async', 'hidden', 'showHidden', 'silent', 's'],
        options: ['depth'],
    },
})
export class EvalCommand extends Command {
    public async run(message: Message, args: Args) {
        const code = (await args.rest('string'))
            .replaceAll('process.env', 'throw new Error("nice try")')
            .replaceAll('dotenv', '--REDACTED--')
            .replaceAll('.env', '--REDACTED--');

        const { result, success, type } = await this.eval(code, {
            message,
            args,
            async: args.getFlags('async'),
            depth: Number(args.getOption('depth') ?? 0),
            showHidden: args.getFlags('hidden', 'showHidden'),
        });

        const output = success ? codeBlock('js', result) : `**ERROR**: ${codeBlock('bash', result)}`;

        if (args.getFlags('silent', 's')) return null;

        const typeFooter = `**Type**: ${codeBlock('typescript', type)}`;

        if (output.length > 2000) {
            return message.reply({
                files: [{ attachment: Buffer.from(output), name: 'output.txt' }],
                content: `Output was too long... sent the result as a file.\n\n${typeFooter}`,
            });
        }

        return message.reply(`${output}\n${typeFooter}`);
    }

    private async eval(
        code: string,
        flags: { async: boolean; depth: number; showHidden: boolean; message: Message; args: Args },
    ) {
        if (flags.async) code = `(async () => {\n${code}\n})();`;

        let success = true;
        let result = null;
        const { message, args } = flags;
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

        result = result
            .replaceAll(client.token!, '--REDACTED--')
            .replaceAll(process.env.DATABASE_URL!, '--REDACTED--')
            .replaceAll(process.env.DISCORD_TOKEN!, '--REDACTED--')
            .replaceAll(process.env.GOOGLE_KEY!, '--REDACTED--')
            .replaceAll(process.env.CUSTOM_SEARCH_ID!, '--REDACTED--')
            .replaceAll(process.env.RAILWAY_STATIC_URL!, '--REDACTED--')
            .replaceAll(process.env.HOSTNAME!, '--REDACTED--')
            .replaceAll(process.env.USER!, '--REDACTED--');

        return { result, success, type };
    }
}
