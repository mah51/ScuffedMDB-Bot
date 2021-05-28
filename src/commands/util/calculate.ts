import type { HelpObj } from '../../structures/commandHandler';
import type BotClient from '../../structures/client';
import { evaluate } from 'mathjs';
import type { Message, PermissionString } from 'discord.js';

export async function run(client: BotClient, message: Message, args: string[]) {
  if (!args[1])
    return client.functions.noArg(message, 1, 'an expression to evaluate.');
  const expression = args.slice(1).join(' ');

  try {
    let out = evaluate(expression);
    if (out.entries) out = out.entries.join('\n');
    else out = out.toString();

    message.channel.send(`**SUCCESS**\n\`\`\`${out}\`\`\``);
  } catch (e) {
    message.reply(
      `Your expression could be not parsed.\n\n\`\`\`xl\n${e.message}\n\`\`\``
    );
  }
}

export const help: HelpObj = {
  aliases: ['algorithm', 'calc', 'math'],
  category: 'Utility',
  desc: 'Calculates a given expression.',
  dm: true,
  isToggleable: true,
  usage: 'calculate <Expression>',
};

export const memberPerms: PermissionString[] = [];

export const permissions: PermissionString[] = [];
