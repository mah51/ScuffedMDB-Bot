import { MessageEmbed } from 'discord.js';
import { WebhookData } from './../types/movie-types';
import BotClient from '../structures/client';
import config from '../config.json';
import millify from 'millify';

export async function run(client: BotClient, data: WebhookData) {
  const { movie } = data;
  const movieName = movie.name[0].toUpperCase() + movie.name.slice(1);
  const server = await client.guilds.fetch(config.serverID);
  const channel = await server.channels.create(movieName, {
    topic: movie._id,
    parent: config.categoryID,
    reason: `${movieName} was created and the webhook was fired.`,
    position: 1,
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
        value:
          '`' +
          releaseDate.getUTCDate() +
          '/' +
          (releaseDate.getMonth() + 1) +
          '/' +
          releaseDate.getUTCFullYear() +
          '`',
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

  const message = await channel.send({ embeds: [embed] });
  await message.pin();
}
