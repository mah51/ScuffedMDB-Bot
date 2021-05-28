import type { Message, TextChannel, Guild, GuildMember } from 'discord.js';

export interface GuildMessage extends Message {
  channel: TextChannel;
  guild: Guild;
  member: GuildMember;
}

export const parsedPerms = {
  ADD_REACTIONS: 'Add Reactions',
  ADMINISTRATOR: 'Administrator',
  ATTACH_FILES: 'Attach Files',
  BAN_MEMBERS: 'Ban Members',
  CHANGE_NICKNAME: 'Change Nickname',
  CONNECT: 'Connect',
  CREATE_INSTANT_INVITE: 'Create Instant Invite',
  DEAFEN_MEMBERS: 'Deafen Members',
  EMBED_LINKS: 'Embed Links',
  KICK_MEMBERS: 'Kick Members',
  MANAGE_CHANNELS: 'Manage Channels',
  MANAGE_EMOJIS: 'Manage Emojis',
  MANAGE_GUILD: 'Manage Server',
  MANAGE_MESSAGES: 'Manage Messages',
  MANAGE_NICKNAMES: 'Manage Nicknames',
  MANAGE_ROLES: 'Manage Roles',
  MANAGE_WEBHOOKS: 'Manage Webhooks',
  MENTION_EVERYONE: 'Mention Everyone',
  MOVE_MEMBERS: 'Move Members',
  MUTE_MEMBERS: 'Mute Members',
  PRIORITY_SPEAKER: 'Priority Speaker',
  READ_MESSAGE_HISTORY: 'Read Message History',
  SEND_MESSAGES: 'Send Messages',
  SEND_TTS_MESSAGES: 'Send TTS Messages',
  SPEAK: 'Speak',
  STREAM: 'Go Live',
  USE_EXTERNAL_EMOJIS: 'Use External Emojis',
  USE_VAD: 'Use Voice Activity',
  VIEW_AUDIT_LOG: 'View Audit Log',
  VIEW_CHANNEL: 'Read Text Channels & See Voice Channels',
};
