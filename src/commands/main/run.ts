import type { CommandOptions, Args } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import parseCodeBlock from '@utils/parseCodeBlock';
import { stripIndents } from 'common-tags';
import type { Message } from 'discord.js';
import Command from '@structures/Command';
import run from 'tio.js';

@ApplyOptions<CommandOptions>({
    description: 'Runs code in a virtual container.',
    aliases: ['code', 'r'],
    category: 'Main',
    usage: '<lang> <code>',
})
export class RunCommand extends Command {
    public async run(message: Message, args: Args) {
        const lang = (await args.pickResult('string')).value;
        const code = parseCodeBlock(await args.rest('string')).code;
        const langs = await run.languages();

        message.channel.startTyping();

        if (!langs.includes(lang!)) {
            message.channel.stopTyping();

            return message.reply({
                embeds: [
                    {
                        description:
                            'You seem to have provided an invalid language. See [this link](https://tio.run/languages.json "Languages List") to see a list of all languages!',
                        color: 'RANDOM',
                    },
                ],
            });
        }

        const result = await run(code, lang, 30000);
        const msg = stripIndents`
                \`\`\`sh
                ${result.output}

                Real Time: ${result.realTime}
                User Time: ${result.userTime}
                System Time: ${result.sysTime}
                CPU Share: ${result.CPUshare}
                Exit Code: ${result.exitCode}
                \`\`\`
            `;

        if (msg.length > 2000)
            return message.reply({
                files: [{ attachment: Buffer.from(msg), name: 'output.txt' }],
                content: 'Output was too long... sent the result as a file.',
            });

        message.channel.stopTyping();
        message.reply(msg);
    }
}
