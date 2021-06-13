import { Message, APIMessage, MessageEmbed, TextChannel } from 'discord.js';
import { CommandOptions, Args, CommandStore } from '@sapphire/framework';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { ApplyOptions } from '@sapphire/decorators';
import SubCommand from '@structures/SubCommand';
import Command from '@structures/Command';

@ApplyOptions<CommandOptions>({
    aliases: ['commands', 'cmd', 'cmds', 'h'],
    description: 'Shows info about the commands.',
    detailedDescription: 'You can also provide a command, which will return info about that command.',
    category: 'Main',
    usage: '[command]',
})
export class HelpCommand extends Command {
    private _commands!: CommandStore;

    public async run(message: Message, args: Args) {
        const commandName = (await args.pickResult('string')).value ?? null;

        if (!commandName) return this.menu(message);

        this._commands = this.context.client.stores.get('commands');

        const command =
            this._commands.get(commandName.toLowerCase()) ??
            this._commands.find((command) => command.aliases.includes(commandName.toLowerCase()));

        if (!command)
            return message.reply("I can't seem to find that command... Maybe try giving a valid command next time?");

        const embed = new MessageEmbed().setColor('RANDOM').setDescription(command.description);

        if (command.aliases.length) embed.addField('Aliases', command.aliases.map((alias) => `\`${alias}\``).join(' '));
        if (command.detailedDescription) embed.addField('Detailed Description', command.detailedDescription);
        if (command.usage) embed.addField('Usage', `\`${command.usage}\``);
        if (command instanceof SubCommand)
            embed.addField(
                'Sub Commands',
                (command.subCommands as any)['entries'].map((sc: any) => `\`${sc.input}\``).join(' '),
            );

        message.reply({ embeds: [embed] });
    }

    private async menu(message: Message) {
        const categories = new Set<string>();

        this._commands = this.context.client.stores.get('commands');

        for (const [, command] of this._commands) categories.add(command.category);

        return new PaginatedMessage({
            pages: [...categories.values()].map(
                (category) => (index, pages) =>
                    new APIMessage(message.channel, {
                        embeds: [
                            new MessageEmbed()
                                .setColor('RANDOM')
                                .setTitle(category)
                                .setDescription(
                                    this._commands
                                        .filter((c) => c.category === category)
                                        .map((cmd) => `\`${cmd.name}\``)
                                        .join(' '),
                                )
                                .setFooter(`Page ${index + 1} / ${pages.length}`),
                        ],
                    }),
            ),
        }).run(message.author, message.channel as TextChannel);
    }
}
