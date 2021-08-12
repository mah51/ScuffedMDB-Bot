import type { Message } from 'discord.js';
import Client from './structures/client';
import { Intents } from 'discord.js';
import type { ClientEvents } from 'discord.js';
import { readdirSync } from 'fs';
import path from 'path';
import { version } from './config.json';
import chalk from 'chalk';
require('dotenv').config();

console.log(chalk`{bold.green Initialising startup sequence... brrrr...}`);

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
  presence: {
    activities: [
      {
        name: `version ${version}`,
        type: 'STREAMING',
      },
    ],
  },
});

const eventList = readdirSync(path.resolve(__dirname, './events'));
eventList.forEach((f) =>
  client.events.set(f.slice(0, -3), require(`./events/${f}`))
);
client.events.forEach((obj, name) =>
  client.on(name as keyof ClientEvents, (...args: any) =>
    obj.run(client, ...args)
  )
);

process.on('SIGINT', () => {
  client.logger.log('it was a pleasre monsieur', 'Au revoir');
  client.apiClient.shutDown();
  client.destroy();
});

process.on('unhandledRejection', (error: Error) =>
  client.logger.error(error.message)
);

process.on('uncaughtExceptionMonitor', (error) =>
  client.logger.error(error.message)
);

process.on('warning', (warning) => {
  client.logger.warn(warning.message);
});

client.login(process.env.BOT_TOKEN);
