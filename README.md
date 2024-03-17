# Freechess

Freechess is an open-source chess GUI to play, view and analyze your chess games from anywhere with Stockfish for free !

It is built with [Next.js](https://nextjs.org/docs), [React](https://react.dev/learn/describing-the-ui), [Material UI](https://mui.com/material-ui/getting-started/overview/), and [TypeScript](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html).

It is deployed on [Firebase](https://firebase.google.com/docs/hosting), see it live [here](https://freechess.web.app).

## Running the app in dev mode

Node 18 and npm are required.

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
