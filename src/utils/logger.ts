import { TextChannel, MessageEmbed } from 'discord.js';
import chalk from 'chalk';
import type BotClient from '../structures/client';
import config from '../../config.json';
class Logger {
  client: BotClient;
  colors: Record<string, `#${string}`>;
  constructor(client: BotClient) {
    this.client = client;
    this.colors = {
      error: '#fb6962',
      warn: '#fcfc99',
      success: '#90EE90',
      info: '#a8e4ef',
      log: '#a8e4ef',
    };
  }
  get now() {
    return Intl.DateTimeFormat('en-GB', {
      minute: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      month: '2-digit',
      year: 'numeric',
      second: '2-digit',
    }).format(Date.now());
  }

  error(error: string, type = 'ERROR') {
    this.postToChannel(error, this.colors.error);
    return console.error(
      `${chalk.red(`[${type.toUpperCase()}]`)}[${this.now}]: ${error}`
    );
  }

  success(success: string, type = 'SUCCESS') {
    this.postToChannel(success, this.colors.success);
    return console.error(
      `${chalk.green(`[${type.toUpperCase()}]`)}[${this.now}]: ${success}`
    );
  }

  warn(warning: string, type = 'WARNING') {
    this.postToChannel(warning, this.colors.warn);
    return console.warn(
      `${chalk.yellow(`[${type.toUpperCase()}]`)}[${this.now}]: ${warning}`
    );
  }

  log(message: string, type = 'INFO') {
    this.postToChannel(message, this.colors.log);
    return console.log(
      `${chalk.blueBright(`[${type.toUpperCase()}]`)}[${this.now}]: ${message}`
    );
  }

  postToChannel(message: string, color: `#${string}`) {
    if (!config.logChannel) {
      return;
    }
    if (!this.client.isReady) return;
    const sterile = message.replace(
      // eslint-disable-next-line no-control-regex
      /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
      ''
    );
    const embed = new MessageEmbed().setDescription(sterile).setColor(color);
    (
      this.client.guilds.cache
        .get(config.serverID)
        ?.channels.cache.get(config!.logChannel) as TextChannel
    )?.send({ embeds: [embed] });
  }
}

export default Logger;
