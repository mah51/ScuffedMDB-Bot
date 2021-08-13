import type { WebhookData } from './../types/movie-types';
import { MessageEmbed, TextChannel } from 'discord.js';
import type BotClient from '../structures/client';
import config from '../../config.json';
import { editReviewEmbed } from './reviewCreate';
import millify from 'millify';

export async function run(client: BotClient, data: WebhookData) {
  const { user, movie, review } = data;

  const embed = new MessageEmbed()
    .setAuthor(`${user.username}#${user.discriminator}`, user.image)
    .setColor(client.config.embedColor)
    .setTitle(`\`${review.rating} / 10\` - ${user.username} - ${movie.name}`)
    .setDescription(`${review.comment}`)
    .setURL(process.env.WEB_URL + '/movie/' + movie._id)
    .setThumbnail(movie.image || '')
    .setFooter(
      typeof review?._id === 'string' ? review?._id : 'Why this no work'
    )
    .setTimestamp()
    .setFields(
      { name: 'Group Score', value: `\`${movie.rating}\``, inline: true },
      {
        name: 'Total Reviews',
        value: `\`${movie.numReviews}\``,
        inline: true,
      },
      {
        name: 'World wide',
        value: `\`${movie.voteAverage} - ${millify(movie.voteCount)} votes\``,
        inline: true,
      }
    );

  const server = await client.guilds.fetch(config.serverID);

  const channel = (await server.channels.cache.find(
    (channel) =>
      channel.type === 'GUILD_TEXT' &&
      (channel as TextChannel).topic === movie._id
  )) as TextChannel;

  if (!channel) {
    return client.logger.error(
      `Channel not found for ${movie.name} when ${user.username} modified their review`
    );
  }

  const allThreads = await channel.threads.fetch();

  const reviewThread = allThreads.threads.find(
    (thread) => thread.name === 'reviews'
  );

  if (!reviewThread) {
    client.logger.error(
      `Thread not found for ${movie.name} when ${user.username} modified their review`
    );
  }

  const messages = await reviewThread!.messages.fetch();
  const message = messages.find(
    (msg) => msg?.embeds?.[0]?.footer?.text === review._id
  );

  if (!message) {
    client.logger.error(
      `Message not found for ${movie.name} when ${user.username} modified their review`
    );
  }

  await message!.edit({ embeds: [embed] });

  await editReviewEmbed(channel, client, movie, user);

  if (reviewThread?.archived) {
    await reviewThread.setArchived(false);
  }

  client.logger.success(`Modified ${user.username}'s review on ${movie.name}`);
}
