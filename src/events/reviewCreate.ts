import { time } from '@discordjs/builders';
import { MessageEmbed, TextChannel } from 'discord.js';
import type {
  MovieType,
  WebhookData,
  UserAuthType,
  ReviewType,
} from './../types/movie-types';
import type BotClient from '../structures/client';
import config from '../../config.json';
import millify from 'millify';

export async function run(client: BotClient, data: WebhookData) {
  const { movie, user, review } = data;
  // Forming the embed to be sent with the review data
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
      { name: 'Total Reviews', value: `\`${movie.numReviews}\``, inline: true },
      {
        name: 'World wide',
        value: `\`${movie.voteAverage} - ${millify(movie.voteCount)} votes\``,
        inline: true,
      }
    );

  const server = await client.guilds.fetch(config.serverID);

  const member = await server.members.fetch(user.discord_id);

  if (member) {
    await member?.roles.add(config.reviewedRoleID);
  }

  // Retrieving channel
  let channel = (await server.channels.cache.find(
    (channel) =>
      channel.type === 'GUILD_TEXT' &&
      (channel as TextChannel).topic === movie._id
  )) as TextChannel;
  if (!channel) {
    client.logger.warn(
      `Could not find channel for ${movie._id}, I am creating one now...`
    );
    client.emit('movieCreate', data, true);
    const channels = await server.channels.fetch();
    channel = channels.find(
      (channel) =>
        channel.type === 'GUILD_TEXT' &&
        (channel as TextChannel).topic === movie._id
    ) as TextChannel;
  }

  // Allowing user to view channel
  await channel.permissionOverwrites.edit(user.discord_id, {
    VIEW_CHANNEL: true,
  });

  // Get threads and add user to discussion thread
  const allThreads = await channel.threads.fetch();

  const discussionThread = allThreads.threads.find(
    (thread) => thread.name === 'discussion'
  );

  discussionThread?.members.add(member);

  // get reviewThread to send embed
  let reviewThread = allThreads.threads.find(
    (thread) => thread.name === 'reviews'
  );
  if (!reviewThread) {
    client.logger.warn(`Thread not found for ${movie.name} creating one now`);
    channel.threads.create({
      name: `reviews`,
      autoArchiveDuration: 'MAX',
      reason: `Adding review thread to ${movie.name} channel`,
    });
    reviewThread = channel.threads.cache.find(
      (thread) => thread.name === 'reviews'
    );
  }
  await editReviewEmbed(channel, client, movie, user);
  // reopen thread if it invalidated
  if (reviewThread?.archived) {
    await reviewThread.setArchived(false);
  }

  // Embed the embed innit
  await reviewThread?.send({ embeds: [embed] });
  return client.logger.success(`Review sent to ${channel.name}`);
}

export async function editReviewEmbed(
  channel: TextChannel,
  client: BotClient,
  movie: MovieType<ReviewType<string>[]> | MovieType,
  user: UserAuthType
) {
  const messages = await channel.messages.fetch();
  const message = messages.find(
    (msg) =>
      msg.author.id === client.user!.id &&
      msg.embeds?.[0]?.author?.name === `${movie.name} Reviews`
  );

  const reviewEmbed = new MessageEmbed()
    .setColor(client.config.embedColor)
    .setAuthor(`${movie.name} Reviews`)
    .setTitle(`\`${movie.numReviews ? `${movie.rating} / 10` : 'N / A'}\``)
    .setDescription(`${user.username} added a review ${time(new Date(), 'R')}`)
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

  await message?.edit({ embeds: [reviewEmbed] });
}
