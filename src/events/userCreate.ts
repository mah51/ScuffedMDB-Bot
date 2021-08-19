import type BotClient from '../structures/client';
import type { WebhookData } from '../types/movie-types';

export async function run(client: BotClient, data: WebhookData) {
  client.logger.log(
    `New user logged into the site: ${data.user.username}#${data.user.discriminator}`
  );
}
