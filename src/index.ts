import type { Message } from 'discord.js';
import Client from './structures/client';
const { Intents } = require('discord.js');
import type { ClientEvents } from 'discord.js';
import { readdirSync } from 'fs';
import { version } from './config.json';
require('dotenv').config();

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    presence: {
        activities: [
            {
                name: `version ${version}`,
                type: 'STREAMING',
            },
        ],
    },
});

const eventList = readdirSync('./dist/events');
eventList.forEach((f) =>
    client.events.set(f.slice(0, -3), require(`./events/${f}`))
);
client.events.forEach((obj, name) =>
    client.on(name as keyof ClientEvents, (...args: any) =>
        obj.run(client, ...args)
    )
);

process.on('unhandledRejection', console.log);

client.login(process.env.BOT_TOKEN);

async function onExit() {
    client.prisma.$disconnect();
}
