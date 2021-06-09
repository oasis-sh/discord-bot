import { Command, CommandOptions, Args } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { codeBlock } from '@sapphire/utilities';
import { stripIndents } from 'common-tags';
import type { Message } from 'discord.js';
import { command } from 'execa';

@ApplyOptions<CommandOptions>({
    aliases: ['$'],
    description: 'Executes a shell command.',
    preconditions: ['OwnerOnly', 'GuildOnly'],
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

            return { err: false, std: data.stderr };
        } catch (err) {
            return { err: true, std: err.message as string };
        }
    }
}
