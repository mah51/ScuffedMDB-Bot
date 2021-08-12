import type { TextChannel } from 'discord.js';
import type { WebhookData } from './../types/movie-types';
import type BotClient from '../structures/client';
import config from '../../config.json';

export async function run(client: BotClient, data: WebhookData) {
  const { movie } = data;
  const server = await client.guilds.fetch(config.serverID);
  const channel = await server.channels.cache.find(
    (channel) =>
      channel.type === 'GUILD_TEXT' &&
      (channel as TextChannel).topic === movie._id
  );

  try {
    if (!channel) {
      return client.logger.error(
        'Could not find a channel with the movie_id in the topic.'
      );
    }
    channel?.delete(`${data.movie.name} was deleted on site`);
  } catch (e) {
    client.logger.error('Could not delete channel on movieDelete');
  }
}
