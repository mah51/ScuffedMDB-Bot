import type { SlashCommandBuilder } from '@discordjs/builders';
import { Collection } from 'discord.js';
import { readdirSync } from 'fs';
import type { Client, Message, PermissionString } from 'discord.js';
import path from 'path';
import type { APIApplicationCommandOption } from 'discord-api-types';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import type BotClient from './client';
import config from '../../config.json';

type CommandCategory = 'Utility';

export interface HelpObj {
  aliases: string[];
  category: CommandCategory;
  desc: string;
  dm?: true;
  private?: boolean;
  isToggleable: boolean;
  usage: string;
}

export interface CommandData {
  prefix: string;
}

export interface Interaction {
  name: string;
  description: string;
  options: APIApplicationCommandOption[];
}
export interface BotCommand {
  help: HelpObj;
  memberPerms: PermissionString[];
  data: SlashCommandBuilder;
  permissions: PermissionString[];
  run: (
    client: Client,
    message: Message,
    args: string[],
    commandData: CommandData
  ) => void;
}

export default class CommandHandler extends Collection<string, BotCommand> {
  commandArray: { name: string; description: string }[][];
  interactionArray: Interaction[];
  client: BotClient;
  public constructor(bot: BotClient) {
    super();
    this.client = bot;
    this.interactionArray = [];
    this.rawCategories = readdirSync(path.resolve(__dirname, '../commands/'));
    this.commandArray = this.rawCategories.map((c) =>
      readdirSync(path.resolve(__dirname, `../commands/${c}`)).map((cmd) => {
        this.list.push(cmd.slice(0, -3));
        const command: BotCommand = require(`../commands/${c}/${cmd}`); // eslint-disable-line @typescript-eslint/no-var-requires, global-require
        this.set(cmd.slice(0, -3), command);
        command.help.aliases.forEach(
          (alias) => (this.aliases[alias] = cmd.slice(0, -3))
        );
        this.aliases[cmd.slice(0, -3)] = cmd.slice(0, -3);

        if (!this.categories.includes(command.help.category)) {
          this.categories.push(command.help.category);
        }
        this.interactionArray.push(command.data.toJSON());
        return {
          name: cmd[0].toUpperCase() + cmd.slice(1).slice(0, -3),
          description: command.help.desc,
        };
      })
    );

    const rest = new REST({ version: '9' }).setToken(
      process.env.BOT_TOKEN as string
    );

    (async () => {
      try {
        console.log('Started refreshing application (/) commands.');
        if (!process.env.CLIENT_ID) {
          throw new Error('CLIENT_ID not set in .env');
        }
        if (!config.serverID) {
          throw new Error('serverID not set in config.json');
        }

        await rest.put(
          Routes.applicationGuildCommands(
            process.env.CLIENT_ID,
            config.serverID
          ),
          {
            //@ts-ignore
            body: this.interactionArray,
          }
        );

        console.log('Successfully reloaded application (/) commands.');
      } catch (error) {
        //@ts-ignore

        console.log(error);
      }
    })();
  }

  public aliases: { [alias: string]: string } = {};

  public categories: CommandCategory[] = [];

  public list: string[] = [];

  public rawCategories: string[] = [];
}
