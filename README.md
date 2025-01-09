<div align="center">
  <a href="https://github.com/GuillaumeSD/Freechess">
    <img width="120" height="120" src="https://github.com/GuillaumeSD/Freechess/blob/main/public/android-chrome-192x192.png" alt="Logo">
  </a>

<h3 align="center">Freechess</h3>
  <p align="center">
    The Ultimate Chess Web App
    <br />
    <a href="https://freechess.web.app/" target="_blank" rel="noopener noreferrer"><strong>freechess.web.app</strong></a>
    <br />
    <a href="https://discord.com/invite/Yr99abAcUr" target="_blank" rel="noopener noreferrer">Discord Server</a>
    ·
    <a href="https://freechess.notion.site/4cf7823836724432b71aa8932ba7d5bb" target="_blank" rel="noopener noreferrer">Features Backlog</a>
  </p>
</div>
<br />

Freechess is an open-source chess web app to play, view and analyze your chess games for free on any device with Stockfish !

## Mission

It aims to offer all the features it can from the best chess apps, while being free and open-source. It is designed to be easy to use, fast, and reliable.

## Features

- Load and analyze games from [chess.com](https://chess.com) and [lichess.org](https://lichess.org)
- Analysis board with live engine evaluation, custom arrows, evaluation graph, ...
- Moves classification (Brilliant, Great, Good, Mistake, Blunder, ...)
- Chess960 and Puzzles support
- Play against Stockfish at any elo
- Store your games in your browser database

<img src="https://github.com/GuillaumeSD/Freechess/blob/main/assets/showcase.png" />

## Stack

Built with [Next.js](https://nextjs.org/docs), [React](https://react.dev/learn/describing-the-ui), [Material UI](https://mui.com/material-ui/getting-started/overview/), and [TypeScript](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html).

Deployed on [Firebase](https://firebase.google.com/docs/hosting), see it live [here](https://freechess.web.app).

## Running the app in dev mode

At least [Node.js](https://nodejs.org) 22.11 is required.

Install the dependencies :

```bash
npm i
```

Run the development server :

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in the browser to see the app running.

The app will automatically refresh on any source file change.

## Lint

Run it with :

```bash
npm run lint
```

## Deploy

To deploy the app, install the [Firebase CLI](https://firebase.google.com/docs/cli) and authenticate, then run :

```bash
npm run deploy
```

## License

GNU General Public License v3.0.

See [COPYING](COPYING) to see the full text.
