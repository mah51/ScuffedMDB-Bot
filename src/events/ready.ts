import type BotClient from '../structures/client';
import chalk from 'chalk';

export async function run(client: BotClient) {
  client.logger.log(
    chalk`Logged in as {magenta.bold ${client.user?.tag}}`,
    'Ready'
  );
}
