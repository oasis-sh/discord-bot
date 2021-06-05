/* eslint-disable @typescript-eslint/require-await */

import { ApplicationCommandData, ApplicationCommandOptionData, Interaction, Message } from 'discord.js';
import { APIMessage } from 'discord-api-types';
import { Client } from './Client';

export class Command {
	public readonly client: Client;
	public readonly name: string;
	public readonly description: string;
	public readonly options?: ApplicationCommandOptionData[];
	public readonly defaultPermission?: boolean;

	public constructor(client: Client, info: ApplicationCommandData) {
		this.client = client;
		this.name = info.name;
		this.description = info.description;
		this.options = info.options;
		this.defaultPermission = info.defaultPermission;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public async run(interaction: Interaction): Promise<Message | APIMessage | undefined | void> {
		throw new Error(`Command "${this.name}" has no run method!`);
	}
}
