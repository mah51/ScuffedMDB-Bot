import { TextChannel } from 'discord.js';
import { WebhookData } from './../types/movie-types';
import BotClient from '../structures/client';
import config from '../config.json';

export async function run(client: BotClient, data: WebhookData) {
  const { movie, user, review } = data;
  const server = await client.guilds.fetch(config.serverID);
  const channel = (await server.channels.cache.find(
    (c) => c.type === 'GUILD_TEXT' && (c as TextChannel).topic === movie._id
  )) as TextChannel;

  if (!channel) {
    client.logger.error(
      'Review could not be removed from movie, as channel does not exist'
    );
  }

  const message = channel.messages.cache.find(
    (msg) => msg?.embeds?.[0]?.footer?.text === review._id
  );

  if (!message) {
    client.logger.error(
      'Review could not be removed from movie, as message could not be located in cache'
    );
  }

  message
    ?.delete()
    .then(() => {
      client.logger.success('Review deleted');
    })
    .catch(() => {
      client.logger.error('Review could not be deleted');
    });

  return await channel
    .send(`${user.username} has deleted their review for ${movie.name}`)
    .then((msg) => setTimeout(() => msg.delete(), 5000));
}
