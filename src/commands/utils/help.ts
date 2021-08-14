import type { HelpObj } from '../../structures/commandHandler';
import { MessageEmbed } from 'discord.js';
import type BotClient from '../../structures/client';
import type { Message, PermissionString } from 'discord.js';
import type { CommandData } from '../../structures/commandHandler';

export async function run(
  client: BotClient,
  message: Message,
  args: string[],
  { prefix }: CommandData
) {
  if (!args[1]) {
    const embed = new MessageEmbed()
      .setColor(client.config.embedColor)
      .setFooter(
        `Requested by ${message.author.tag}`,
        message.author.displayAvatarURL()
      )
      .setTimestamp()
      .setAuthor('Commands List', client?.user?.displayAvatarURL());

    client.commands.forEach((cmd) => {
      const cmdInfo = client.commands.aliases[cmd.help.aliases[0]];
      const info = cmd.help;

      const field = embed.fields.find((f) => f.name === info.category);
      if (field)
        embed.fields[embed.fields.indexOf(field)].value += `\n- \`${
          //@ts-ignore
          prefix + cmdInfo
        }\``;
      //@ts-ignore
      else embed.addField(info.category, `- \`${prefix + cmdInfo}\``, true);
    });

    return message.channel.send({ embeds: [embed] });
  }

  const query = args.slice(1).join(' ').toLowerCase();
  if (
    !client.commands.aliases[query] &&
    !client.commands.categories.some((c) => c.toLowerCase() === query)
  )
    return client.functions.badArg(
      message,
      1,
      'The query provided was neither a category or a command.'
    );

  const cmd = client.commands.get(client.commands.aliases[query]);
  if (cmd) {
    const embed = new MessageEmbed()
      .addFields([
        {
          inline: true,
          name: 'Usage',
          value: prefix + cmd.help.usage,
        },
        {
          inline: true,
          name: 'Category',
          value: cmd.help.category,
        },
        {
          inline: true,
          name: 'Usable in DMs',
          value: cmd.help.dm ? 'Yes' : 'No',
        },
      ])
      .setColor(client.config.embedColor)
      .setDescription(cmd.help.desc)
      .setFooter(
        '[Arg] = Optional | <Arg> = Required',
        message.author.displayAvatarURL()
      )
      .setTitle(`${prefix + query} Command Information`);
    if (cmd.help.aliases.length !== 0)
      embed.addField(
        'Aliases',
        cmd.help.aliases.map((alias) => `\`${prefix + alias}\``).join(', '),
        true
      );

    return message.channel.send({ embeds: [embed] });
  }

  const category = client.commands.categories.find(
    (c) => c.toLowerCase() === query
  );
  const cCommands = client.commands.filter(
    (c) => c.help.category.toLowerCase() === query
  );
  const embed = new MessageEmbed()
    .setColor(client.config.embedColor)
    .setDescription(cCommands.map((c) => `- \`${prefix + c}\``).join('\n'))
    .setFooter(
      `${cCommands.size} Category Commands | Requested by ${message.author.tag}`,
      message.author.displayAvatarURL()
    )
    .setTimestamp()
    .setTitle(`${category} Category Information`);

  message.channel.send({ embeds: [embed] });
}

export const help: HelpObj = {
  aliases: ['command', 'commands'],
  category: 'Utility',
  desc: 'Displays the help menu or shows information about a command or category.',
  dm: true,
  isToggleable: false,
  usage: 'help [Command or Category]',
};

export const memberPerms: PermissionString[] = [];

export const permissions: PermissionString[] = ['EMBED_LINKS'];
