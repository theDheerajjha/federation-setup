# Users App (Vue 3)

A remote micro-frontend that displays a user table, designed to be loaded by a Vue 2 shell app using Module Federation.

## Local Setup

```bash
cd users-app-vue3
npm install
npm run serve
```

## How It Works

- Exposes a user table as a remote app
- Receives state and i18n from the parent shell
- Can be run standalone or as a remote in the shell

## Access Point

- Local: http://localhost:3001 