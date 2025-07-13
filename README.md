# Federation Setup with Vue2

A modular frontend platform where a Vue 2 shell dynamically loads Vue 3 remote applications using Module Federation.

## Local Setup

```bash
# Install dependencies for all apps
cd shell-vue2 && npm install
cd ../users-app-vue3 && npm install  
cd ../edit-user-app-vue3 && npm install

# Run all applications (in separate terminals)
# Terminal 1 - Shell app (Vue 2)
cd shell-vue2 && npm run serve

# Terminal 2 - Users app (Vue 3) 
cd users-app-vue3 && npm run serve

# Terminal 3 - Edit user app (Vue 3)
cd edit-user-app-vue3 && npm run serve
```

## What's Built

- **shell-vue2**: Vue 2 host app with global store, i18n, and routing
- **users-app-vue3**: Vue 3 remote app that displays user table
- **edit-user-app-vue3**: Vue 3 remote app for editing users

## How It Works

The Vue 2 shell owns the global state and i18n. Vue 3 remote apps are loaded dynamically and communicate with the shell through events. Remote apps don't have their own state or i18n - they consume everything from the parent shell.

## Access Points

- Shell app: http://localhost:3000
- Users app: http://localhost:3001  
- Edit user app: http://localhost:3002

Navigate to /users in the shell to see the user list, or /edit-user?id=1 to edit a specific user. 