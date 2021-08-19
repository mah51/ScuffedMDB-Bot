import type BotClient from '../structures/client';
import type { WebhookData } from '../types/movie-types';

export async function run(client: BotClient, data: WebhookData) {
  client.logger.log(
    `User was banned from the site: ${data.ban.user.username}#${data.ban.user.discriminator}\nReason: ${data.ban.reason}`
  );
}
