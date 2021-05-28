import * as config from '../config.json';
import CommandHandler from './commandHandler';
import { Client, Collection } from 'discord.js';
import type { Snowflake } from 'discord.js';
import { Functions } from './functions';
import { PrismaClient } from '@prisma/client';

interface ConfigObject {
    embedColor: string;
    ownerID: Snowflake;
    prefix: string;
    version: string;
}

export interface BotEvent {
    run: (...args: any) => void;
}

const prisma = new PrismaClient();

export default class BotClient extends Client {
    public commands = new CommandHandler();

    public config: ConfigObject = config;

    public events = new Collection<string, BotEvent>();

    public functions = new Functions();

    public prefixes: { [id: string]: string } = {};

    public prisma = prisma;
}
