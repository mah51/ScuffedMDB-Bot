import type { SlashCommandBuilder } from '@discordjs/builders';
import { Collection } from 'discord.js';
import { readdirSync } from 'fs';
import type { Client, Message, PermissionString } from 'discord.js';
import path from 'path';
import type BotClient from './client';

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
  client: BotClient;
  public constructor(bot: BotClient) {
    super();
    this.client = bot;
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
        return {
          name: cmd[0].toUpperCase() + cmd.slice(1).slice(0, -3),
          description: command.help.desc,
        };
      })
    );
  }

  public aliases: { [alias: string]: string } = {};

  public categories: CommandCategory[] = [];

  public list: string[] = [];

  public rawCategories: string[] = [];
}
