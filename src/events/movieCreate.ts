import { MessageEmbed, Permissions } from 'discord.js';
import type { WebhookData } from './../types/movie-types';
import { time } from '@discordjs/builders';
import type BotClient from '../structures/client';
import config from '../../config.json';
import millify from 'millify';

export async function run(client: BotClient, data: WebhookData) {
  const { movie } = data;
  const movieName = movie.name[0].toUpperCase() + movie.name.slice(1);
  const server = await client.guilds.fetch(config.serverID);
  if (!server)
    return client.logger.error(
      'Cannot find server with ID: ' + config.serverID
    );

  const members = await server.members.fetch();
  const membersWithRole = members.filter((member) =>
    member.roles.cache.get(config.reviewedRoleID) ? true : false
  );
  await membersWithRole?.each(async (member) => {
    await member.roles
      .remove(config.reviewedRoleID)
      .catch((err) =>
        client.logger.error(
          `Could not remove reviewed role from ${member.user.tag}\n${err}`
        )
      );
  });

  const channel = await server.channels.create(movieName, {
    topic: movie._id,
    parent: config.categoryID,
    reason: `${movieName} was created and the webhook was fired.`,
    position: 1,
    permissionOverwrites: [
      {
        id: server.roles.everyone.id,
        deny: [Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.VIEW_CHANNEL],
      },
      {
        id:
          config.reviewedRoleID ||
          server.roles.cache.find((role) => role.name === 'Reviewed')?.id ||
          '',
        allow: [Permissions.FLAGS.VIEW_CHANNEL],
      },
      {
        id: client.user!.id,
        allow: [
          Permissions.FLAGS.SEND_MESSAGES,
          Permissions.FLAGS.VIEW_CHANNEL,
        ],
      },
    ],
  });

  const releaseDate = new Date(movie.releaseDate);
  const revenue = movie.revenue > 0 ? `$${millify(movie.revenue)}` : 'N/A';
  const budget = movie.budget > 0 ? `$${millify(movie.budget)}` : 'N/A';
  const genres = movie.genres.length > 0 ? movie.genres.join('`, `') : 'N/A';
  const embed = new MessageEmbed()
    .setTitle(movieName)
    .setColor(client.config.embedColor)
    .setURL(process.env.WEB_URL + `/movie/${movie._id}`)
    .setDescription(movie.description || '')
    .setImage(movie.image || '')
    .addFields(
      { name: 'Tagline', value: `\`${movie.tagLine}\`` || '' },
      {
        name: 'Genres',
        value: `\`${genres}\``,
        inline: true,
      },
      {
        name: '\u200b',
        value: `\u200b`,
        inline: true,
      },
      {
        name: 'Links',
        value: `[View on IMDB](https://imdb.com/title/${
          movie.imdbID
        })\n[View on ${process.env.WEBSITE_NAME || 'ScuffedMDB'}](${
          process.env.WEB_URL || 'https://movie.michael-hall.me'
        }/movie/${movie._id} )`,
        inline: true,
      },
      {
        name: 'Info',
        value: `Budget : \`${budget}\`\nRevenue : \`${revenue}\``,
        inline: true,
      },
      {
        name: 'Release Date',
        value: time(new Date(releaseDate), 'd'),
        inline: true,
      },
      {
        name: 'Runtime',
        value: `\`${movie.runtime.toString()} mins\``,
        inline: true,
      }
    )
    .setFooter(
      `Provided by ${client.user?.username}`,
      client.user?.displayAvatarURL()
    )
    .setTimestamp();

  const reviewEmbed = new MessageEmbed()
    .setColor(client.config.embedColor)
    .setAuthor(`${movieName} Reviews`)
    .setTitle(`\`N / A\``)
    .setDescription(`This movie does not have any reviews yet`)
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

  await channel.send({ embeds: [embed] });
  const reviewMessage = await channel.send({ embeds: [reviewEmbed] });
  await reviewMessage.startThread({
    name: `reviews`,
    autoArchiveDuration: server.features.includes('SEVEN_DAY_THREAD_ARCHIVE')
      ? 10080
      : server.features.includes('THREE_DAY_THREAD_ARCHIVE')
      ? 4320
      : 1440,
    reason: `Adding review thread to ${movieName} channel`,
  });
  await channel.threads.create({
    name: `discussion`,
    autoArchiveDuration: server.features.includes('SEVEN_DAY_THREAD_ARCHIVE')
      ? 10080
      : server.features.includes('THREE_DAY_THREAD_ARCHIVE')
      ? 4320
      : 1440,
    reason: `Adding discussion thread to ${movieName} Channel`,
  });
}
