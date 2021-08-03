import * as config from '../config.json';
import CommandHandler from './commandHandler';
import { Client, Collection } from 'discord.js';
import type { Snowflake } from 'discord.js';
import { Functions } from './functions';
import Logger from '../utils/logger';
import APIClient from './APIClient';

interface ConfigObject {
  embedColor: `#${string}`;
  ownerID: Snowflake;
  prefix: string;
  serverID: Snowflake;
  version: string;
}

export interface BotEvent {
  run: (...args: any) => void;
}

export default class BotClient extends Client {
  public commands = new CommandHandler();

  public config: ConfigObject = {
    ...config,
    embedColor: `#${config.embedColor.slice(1)}`,
  };

  public apiClient = new APIClient(this);

  public logger = new Logger();

  public events = new Collection<string, BotEvent>();

  public functions = new Functions();

  public prefixes: { [id: string]: string } = {};
}
