import type {
  Message,
  Snowflake,
  PermissionString,
  GuildChannel,
} from 'discord.js';
import type { GuildMessage } from '../constants';
import { parsedPerms } from '../constants';
import { MessageEmbed, Util } from 'discord.js';
import { embedColor } from '../config.json';
import type BotClient from './client';

export class Functions {
  public noArg(
    message: Message | GuildMessage,
    argNum: number,
    desc: string
  ): void {
    if (
      message.channel.type === 'text' &&
      !message.channel.permissionsFor(message.guild!.me!)!.has('EMBED_LINKS')
    ) {
      message.channel.send(
        `Argument **#${argNum}** was missing. It is supposed to be **${desc}**`
      );
      return;
    }

    const embed = new MessageEmbed()
      .setColor(embedColor)
      .setDescription(
        `Argument #${argNum} is missing. It is supposed to be **${desc}**`
      )
      .setFooter(
        `Executed by ${message.author.tag}`,
        message.author.displayAvatarURL()
      )
      .setTimestamp()
      .setTitle(`Argument #${argNum} Missing`);

    message.channel.send(embed);
  }

  public parseArgs(str: string): string[] {
    const cmd = str.split(/\s+/)[0];
    str = str.slice(cmd.length);
    const regex = /"(.+?(?<!\\))"(?!\S)|(\S+)/gs;
    const matches = [...str.matchAll(regex)].map((s) => {
      const match = s[1] || s[0];
      if (match.includes(' '))
        return match.replace(/\\"/gs, '"').replace(/\\ /gs, ' ');
      return match;
    });

    return [cmd, ...matches];
  }

  public badArg(
    message: Message | GuildMessage,
    argNum: number,
    desc: string
  ): void {
    if (
      message.channel.type === 'text' &&
      !message.channel.permissionsFor(message.guild!.me!)!.has('EMBED_LINKS')
    ) {
      message.channel.send(
        `Argument **#${argNum}** was invalid. Here's what was wrong with it.\n\n**${desc}**`
      );
      return;
    }

    const embed = new MessageEmbed()
      .setColor(embedColor)
      .setDescription(
        `Argument #${argNum} is invalid. Here's what was wrong with it.\n\n**${desc}**`
      )
      .setFooter(
        `Executed by ${message.author.tag}`,
        message.author.displayAvatarURL()
      )
      .setTimestamp()
      .setTitle(`Argument #${argNum} Incorrect`);

    message.channel.send(embed);
  }

  public async getPrefix(client: BotClient, id: Snowflake): Promise<string> {
    return '!';
  }

  public noClientPerms(
    message: Message,
    perms: PermissionString[],
    channel?: GuildChannel
  ): void {
    const formatted = perms
      .map((p) => `\`${parsedPerms[p as keyof typeof parsedPerms]}\``)
      .join('\n');
    if (channel)
      return void message.channel.send(
        `I do not have the required permissions in ${
          channel.type === 'text' ? channel : `**${channel.name}**`
        }.\nThe permissions are:\n\n${formatted}`
      );
    message.channel.send(
      `I do not have the required permissions.\nThe permissions are:\n\n${formatted}`
    );
  }

  public noPerms(
    message: Message,
    perms: PermissionString[],
    channel?: GuildChannel
  ): void {
    const formatted = perms
      .map((p) => `\`${parsedPerms[p as keyof typeof parsedPerms]}\``)
      .join('\n');
    if (channel) {
      message.channel.send(
        `You do not have the required permissions in ${
          channel.type === 'text'
            ? channel
            : `**${Util.escapeMarkdown(channel.name)}**`
        }.\nThe permissions are:\n\n${formatted}`
      );
      return;
    }

    message.channel.send(
      `You do not have the required permissions.\nThe permissions are:\n\n${formatted}`
    );
  }
}
