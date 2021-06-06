/* eslint-disable @typescript-eslint/require-await */

import type { Awaited } from '@sapphire/utilities';
import type { ClientEvents } from 'discord.js';
import type { Client } from './Client';

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
    public run(...args: any[]): Awaited<void> {
        throw new Error(`Event "${this.name}" has no run implementation!`);
    }
}
