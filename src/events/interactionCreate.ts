import type { Interaction } from 'discord.js';
import type BotClient from '../structures/client';

export async function run(client: BotClient, interaction: Interaction) {
  if (!interaction.isCommand()) return;

  const interactions = client.commands.interactionArray.find(
    (command) => command.name === interaction.commandName
  );
  console.log(interactions);
}
