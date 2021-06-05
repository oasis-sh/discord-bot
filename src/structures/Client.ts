import { Client as BaseClient, Intents, Collection } from 'discord.js';
import consola, { Consola } from 'consola';
import { Command } from './Command';
import { dirname, sep } from 'path';
import { promisify } from 'util';
import { Event } from './Event';
import Glob from 'glob';

const glob = promisify(Glob);

export class Client extends BaseClient {
	public readonly logger: Consola;
	public readonly events = new Collection<string, Event>();
	public readonly commands = new Collection<string, Command>();
	public readonly owners = ['566155739652030465', '576580130344927243'];

	public constructor() {
		super({
			intents: [Intents.NON_PRIVILEGED, Intents.FLAGS.GUILDS],
			partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER'],
			presence: {
				activities: [
					{
						name: 'Oasis go to the moon!',
						type: 'WATCHING',
					},
				],
				status: 'online',
			},
		});

		this.logger = consola.create({ level: 5 });
	}

	public get directory() {
		return `${dirname(require.main?.filename!)}${sep}`;
	}

	public async login(token = process.env.DISCORD_TOKEN) {
		await this.loadCommands();
		await this.loadEvents();

		return super.login(token);
	}

	public async loadEvents() {
		const events = await glob(`${this.directory}events/**/*.js`);

		for (const eventFile of events) {
			delete require.cache[eventFile];

			const File = require(eventFile);
			const event = new File(this) as Event;

			this.logger.info(`Loaded event: ${event.name}`);
			this.events.set(event.name, event);
			this[event.type](event.name, (...args) => event.run(...args));
		}
	}

	public async loadCommands() {
		const commands = await glob(`${this.directory}commands/**/*.js`);

		for (const commandFile of commands) {
			delete require.cache[commandFile];

			const File = require(commandFile);
			const command = new File(this) as Command;

			this.logger.info(`Loaded command: ${command.name}`);
			this.commands.set(command.name, command);
		}
	}
}
