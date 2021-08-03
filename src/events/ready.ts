import type BotClient from '../structures/client';
import chalk from 'chalk';
import { CategoryChannel } from 'discord.js';

export async function run(client: BotClient) {
  client.logger.log(chalk`Logged in as {magenta.bold ${client.user?.tag}}`, 'Ready');
}
