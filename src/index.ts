import '@sapphire/plugin-logger/register';
import 'reflect-metadata';
import 'dotenv/config';

import { Client } from '@structures/Client';

const client = new Client();

client.login();
