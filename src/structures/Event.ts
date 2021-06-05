/* eslint-disable @typescript-eslint/require-await */

import { ClientEvents } from 'discord.js';
import { Client } from './Client';

type EventNames = keyof ClientEvents;

interface EventOptions {
	type?: 'once' | 'on';
}

export class Event {
	public readonly client: Client;
	public readonly name: EventNames;
	public readonly type: 'once' | 'on';

	public constructor(client: Client, name: EventNames, options?: EventOptions) {
		this.client = client;
		this.name = name;
		this.type = options?.type ?? 'on';
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public async run(...args: any[]) {
		throw new Error(`Event "${this.name}" has no run implementation!`);
	}
}
