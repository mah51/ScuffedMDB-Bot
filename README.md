# ScuffedMDB-Bot

This is a discord bot for the [ScuffedMDB](https://www.github.com/mah51/scuffedmdb) website, if you are hosting this website, this bot could be for you!

## What does it do?

### Reacts to events

#### Movie Actions

- Movie Added

_Channel creation under specified category_

![image](https://user-images.githubusercontent.com/47287285/129364735-b6ad1d16-2ac3-4e75-a186-d88961ff6be1.png)

- Movie Deleted

_Channel Deletion_

#### Review Actions

- Review Added

  _Embed added to review thread under movie channel_

![image](https://user-images.githubusercontent.com/47287285/129364908-e340ad9c-fa78-48b2-ad73-249bb0132320.png)

- Review Modified

_Embed updated_

- Review Deleted

_Embed removed from thread_

#### User Actions

- User Added

WIP

- User Banned

WIP

### Commands

WIP

## Set this up for your server

First go to the developer panel on discord and create a new application, then under the Bot tab create a new bot and save the bot token for later.

To invite the bot to a server of your choice, insert your client id found under the general information tab of the discord developer panel, to the following URL and then visit it on your browser.

`https://discord.com/api/oauth2/authorize?client_id=<CLIENT_ID>&permissions=8&scope=bot%20applications.commands`

Select the server you want the bot in, and job done!

Download files:

```bash
git clone https://github.com/mah51/scuffedmdb-bot.git
```

Install dependencies:

```bash
npm install
```

Configuration:

config.json

```js
{
  //version of the bot
  "version": "1.0.0",
  //owner of the bot
  "ownerID": "143699512790089729",
  //prefix for commands
  "prefix": "?",
  //color of standard embeds
  "embedColor": "#a70000",
  //ID of the server the bot is operating in
  "serverID": "689991856930553917",
  //category that new channels will be created on movie addition
  "categoryID": "875431541025693757",
  // the role that a user receives on reviewing the latest movie
  "reviewedRoleID": "875431637914107955",
  // If this value is true, the bot will log every event in console, to a certain channel.
  "logChannel": "875590238255333396"
}
```

Copy .env.example, rename to .env and fill in the values.
.env

```txt
BOT_TOKEN=<your bot token go to developer tab on discord create new application -> bot create bot -> copy bot token>
WEB_URL=<THE WEBSITE URL eg. https://movie.michael-hall.me>
WEBHOOK_TOKEN=<This needs to be the same token as in the website repo, and acts as a password so make it secure!>

```

Running the bot:

```bash
npm run build
```

```bash
npm run start
```

_NB: If you want to make changes to the bot fork it first and then clone it, but make sure whenever you make a change and want to run it in production you need to run `npm run build` to compile the typescript to js_.

Running the bot in dev mode:

If you use vscode you can use the profile in launch.json to run the bot, or `nodemon .` if not.
