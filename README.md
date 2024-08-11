# Grim Bot
<p align="center">
  <img src="./docs/mr_grim.png" alt="Sublime's custom image"/>
</p>

<p align="center">
  <strong> ✨ <u>An entertaining unique bot made by InspaStorm</u> ✨</strong>
</p>

## Features 🚀
Made using `Discord.js` and `node.js`
- Unique commands
- Unique features, like
  - Hmm replying
  - Custom hmm replies
- (/) Slash commands
- Many more..!

## Commands available 👨‍⚖️
- Achievements:
  - `achievements`: Showcases the achievements earned by the author
- Economy:
  - `balance`: View your hard earned Grims!
  - `inventory`: Get a look inside of your inventory
  - `shop`: Exchange Grims for some spicy items
  - `use`: Use the things in your inventory
- Fun:
  - `avatar`: Shows off your avatar
  - `leaderboard`: Preview the chad chatters
  - `speedmath`: Calculate as fast as you can!
  - `tic-tac-toe`: A simple tic tac toe game
- Support:
  - `help`: The complete guide for all commands made available by Mr. Grim
  - `invite`: Invite links for the bot and support server
- Utilities:
  - `about`: Get some details about Mr. Grim
  - `custom-replies`: Get the list of custom replies in your server
  - `level`: Shows the chatting xp of the author
  - `ping`: Check ping of the bot
  - `reloadcmd`: Reload bot commands
  - `change-serverconf`: Change bot config of the current server

## Pre-requisites 👐🏻
- Needs a MongoDB server
- Prepare a databse with collection described in [schema.md](docs/schema.md)

## Development Setup 🛠️

- Create `.env` file as:
```dotenv
BOT_TOKEN= # Paste discord bot token here
DB_KEY= # Connection URL to MongoDB server (Eg: mongodb://localhost:27017 for local server)
IS_DEVOLOPMENT=true # Whether to start the bot in development environment
```
- Install dependency packages:
```shell
npm install
```
- Atlast, run: (for development)
```shell
npm run dev
```

## Production Setup 🏗
- Create `.env` file as:
```dotenv
BOT_TOKEN= # Paste discord bot token here
DB_KEY= # Connection URL to MongoDB server
IS_DEVOLOPMENT=false # Whether to start the bot in development environment
```
- Install dependency packages:
```shell
npm install
```
- Atlast, run: (for development)
```shell
npm run build
npm run start
```

## Links ⛓️

- [Invite Mr. Grim](https://discord.com/api/oauth2/authorize?client_id=796625057391837185&permissions=137442479168&scope=bot%20applications.commands) to your server
