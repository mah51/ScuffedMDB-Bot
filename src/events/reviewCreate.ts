import { MessageEmbed, TextChannel } from 'discord.js';
import { WebhookData } from './../types/movie-types';
import BotClient from '../structures/client';
import config from '../config.json';
import millify from 'millify';
export async function run(client: BotClient, data: WebhookData) {
  const { movie, user, review } = data;
  const embed = new MessageEmbed()
    .setAuthor(`${user.username}#${user.discriminator}`, user.image)
    .setColor(client.config.embedColor)
    .setTitle(`\`${review.rating} / 10\` - ${user.username} - ${movie.name}`)
    .setDescription(`${review.comment}`)
    .setURL(process.env.WEB_URL + '/movie/' + movie._id)
    .setThumbnail(movie.image || '')
    .setFooter(review._id)
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
  let channel = await server.channels.cache.find(
    (channel) =>
      channel.type === 'GUILD_TEXT' &&
      (channel as TextChannel).topic === movie._id
  );
  if (!channel) {
    client.logger.warn(
      `Could not find channel for ${movie._id}, I am creating one now...`
    );
    client.emit('movieCreate', data);
    channel = await server.channels.cache.find(
      (channel) =>
        channel.type === 'GUILD_TEXT' &&
        (channel as TextChannel).topic === movie._id
    );
  }

  return await (channel as TextChannel).send({ embeds: [embed] });
}
