import { stripIndents } from 'common-tags';
import { writeFileSync } from 'fs';
import prompt from './prompt';
import chalk from 'chalk';

console.log(chalk.greenBright('Oasis Discord Bot Setup'));

const token = prompt(chalk.yellowBright('What is the bot token?'));
const db = prompt(chalk.yellowBright('What is the postgres db url?'));
const env = stripIndents`
    DISCORD_TOKEN="${token}"
    DATABASE_URL="${db}"
`;

writeFileSync('./.env', env);

console.log(chalk.greenBright('Setup Complete!'));
