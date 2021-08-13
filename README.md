# ScuffedMDB-Bot

This is a discord bot for the [ScuffedMDB](https://www.github.com/mah51/scuffedmdb) website, if you are hosting this website, this bot could be for you!

## What does it do?

### Reacts to events

#### Movie Actions

- Movie Added
- Movie Deleted

#### Review Actions

- Review Added
- Review Modified
- Review Deleted

#### User Actions

- User Added
- User Banned

### Commands

WIP

## Set this up for your server

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
