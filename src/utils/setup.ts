import { stripIndents } from 'common-tags';
import { writeFileSync } from 'fs';
import prompt from './prompt';
import chalk from 'chalk';

console.log(chalk.greenBright('Oasis Discord Bot Setup\n'));

const token = prompt(chalk.yellowBright('What is the bot token?'));
const db = prompt(chalk.yellowBright('What is the postgres db url?'));
const searchID = prompt(chalk.yellowBright('What is your custom search engine id?'));
const googleKey = prompt(chalk.yellowBright('What is your google api key?'));
const env = stripIndents`
    # The environment variables for the oasis discord bot!

    DISCORD_TOKEN="${token}"
    DATABASE_URL="${db}"
    CUSTOM_SEARCH_ID="${searchID}"
    GOOGLE_KEY="${googleKey}"
`;

writeFileSync('./.env', env);

console.log(chalk.greenBright('\nSetup Complete!'));
