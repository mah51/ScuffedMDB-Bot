import type { Message } from 'discord.js';
import type BotClient from '../structures/client';

export async function run(client: BotClient, message: Message) {
  if (message.author.bot || (message.guild && !message.guild.available)) return;
  const prefix = message.guild
    ? await client.functions.getPrefix()
    : client.config.prefix;
  const regexp = new RegExp(`^<@!?${message.client.user!.id}>`);
  if (
    (!message.content.startsWith(prefix) && !message.content.match(regexp)) ||
    message.content === prefix
  ) {
    return;
  }
  let str: string;
  if (message.content.match(regexp))
    str = message.content.slice(message.content.match(regexp)![0].length);
  else str = message.content.slice(prefix.length);
  const args = client.functions.parseArgs(str);
  let cmd = args[0];
  if (!Object.keys(client.commands.aliases).includes(cmd)) return;

  if (message.guild && message.channel.type !== 'DM') {
    if (!message.channel.permissionsFor(client.user!)!.has(['SEND_MESSAGES']))
      return;
  }

  cmd = client.commands.aliases[cmd];

  const cmdInfo = client.commands.get(cmd)!;
  if (message.channel.type === 'DM') {
    if (!cmdInfo.help.dm)
      return message.reply('This command is only available in servers.');
  } else if (
    !message.channel.permissionsFor(message.member!)!.has(cmdInfo.memberPerms)
  )
    return client.functions.noPerms(
      message,
      cmdInfo.memberPerms,
      message.channel
    );
  else if (
    !message.channel.permissionsFor(client.user!)!.has(cmdInfo.permissions)
  )
    return client.functions.noClientPerms(
      message,
      cmdInfo.permissions,
      message.channel
    );
  else if (cmdInfo.help.private && message.author.id !== client.config.ownerID)
    return;

  const commandData = {
    prefix,
  };

  cmdInfo.run(client, message, args, commandData);
}
