import { CommandOptions, Args } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { codeBlock } from '@sapphire/utilities';
import { stripIndents } from 'common-tags';
import type { Message } from 'discord.js';
import Command from '@structures/Command';
import { promisify } from 'util';
import shell from 'shelljs';

const command = promisify(shell.exec);

@ApplyOptions<CommandOptions>({
    aliases: ['$'],
    description: 'Executes a shell command.',
    preconditions: ['OwnerOnly', 'GuildOnly'],
    category: 'Developer',
})
export class ExecCommand extends Command {
    public async run(message: Message, args: Args) {
        const input = await args.rest('string');
        const result = await this.exec(input);
        const content = stripIndents`
            *${result.err ? 'An error occured.' : 'Successfully executed.'}*

            ${codeBlock('sh', result.std)}
        `;

        if (content.length > 2000)
            return message.reply({ files: [{ attachment: Buffer.from(content), name: 'output.txt' }] });

        message.reply(content);
    }

    private async exec(input: string) {
        try {
            const data = await command(input);

            return { err: false, std: data };
        } catch (err) {
            return { err: true, std: err as string };
        }
    }
}
