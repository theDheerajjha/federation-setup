# Vue 2 + Vue 3 Module Federation Demo

A demonstration of Module Federation with Vue 2 as the host shell and Vue 3 as remote applications. This project showcases how legacy Vue 2 applications can integrate with newer Vue 3 applications using iframe-based isolation while maintaining shared state, i18n, and communication through events.

## 🏗️ Architecture

- **Shell App (Vue 2)**: Host application that manages global state, i18n, and provides navigation
- **Users App (Vue 3)**: Remote application for displaying and managing users, loaded in iframe
- **Edit User App (Vue 3)**: Remote application for creating and editing users, loaded in iframe

## ✨ Features

- **Iframe-Based Integration**: Vue 3 apps run in isolated iframes within Vue 2 shell
- **Shared State Management**: Vue.observable store shared across all apps
- **Internationalization**: Shared i18n instance with English translations
- **Event-Driven Communication**: Event bus for inter-app communication
- **Mock API**: Simulated API calls with realistic delays
- **Responsive Design**: Modern UI with mobile-friendly layouts
- **TypeScript Support**: Full TypeScript support in Vue 3 apps
- **Error Handling**: Comprehensive error handling and loading states
- **Cross-Origin Communication**: PostMessage API for iframe communication

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd federation-assignment
   ```

2. **Install dependencies for all apps**
   ```bash
   # Install shell app dependencies
   cd shell-vue2
   npm install

   # Install users app dependencies
   cd ../users-app-vue3
   npm install

   # Install edit user app dependencies
   cd ../edit-user-app-vue3
   npm install
   ```

3. **Start all applications**
   
   Open three terminal windows and run:

   **Terminal 1 - Shell App (Vue 2)**
   ```bash
   cd shell-vue2
   npm run serve
   ```
   Shell app will be available at: http://localhost:3000

   **Terminal 2 - Users App (Vue 3)**
   ```bash
   cd users-app-vue3
   npm run serve
   ```
   Users app will be available at: http://localhost:3001

   **Terminal 3 - Edit User App (Vue 3)**
   ```bash
   cd edit-user-app-vue3
   npm run serve
   ```
   Edit User app will be available at: http://localhost:3002

4. **Access the application**
   
   Navigate to http://localhost:3000 to see the shell application with navigation to the remote apps.

## 📁 Project Structure

```
federation-assignment/
├── shell-vue2/                 # Vue 2 Host Application
│   ├── src/
│   │   ├── store/             # Global state management
│   │   ├── i18n/              # Internationalization
│   │   ├── utils/             # Event bus and utilities
│   │   ├── views/             # Page components
│   │   │   ├── Home.vue       # Landing page
│   │   │   └── RemoteApp.vue  # Iframe wrapper for Vue 3 apps
│   │   ├── router/            # Vue Router configuration
│   │   └── App.vue            # Main shell component
│   ├── vue.config.js          # Module Federation config
│   └── package.json
├── users-app-vue3/            # Vue 3 Users Remote App
│   ├── src/
│   │   ├── App.vue            # Users list component
│   │   └── main.ts            # Entry point
│   ├── vue.config.js          # Module Federation config
│   └── package.json
├── edit-user-app-vue3/        # Vue 3 Edit User Remote App
│   ├── src/
│   │   ├── App.vue            # User edit form component
│   │   └── main.ts            # Entry point
│   ├── vue.config.js          # Module Federation config
│   └── package.json
└── README.md
```

## 🔧 Configuration

### Iframe Integration

The shell app uses iframe-based integration to host Vue 3 remote apps:

**RemoteApp.vue Component**
- Loads Vue 3 apps in iframes for complete isolation
- Handles navigation between different remote apps
- Manages iframe communication via postMessage API
- Provides loading states and error handling

**Iframe URLs**
- Users App: `http://localhost:3001`
- Edit User App: `http://localhost:3002`

### Module Federation Setup

Each app has its own Module Federation configuration:

**Shell App (Vue 2)**
- Exposes: store, i18n, eventBus
- Remotes: usersApp, editUserApp
- Port: 3000

**Users App (Vue 3)**
- Exposes: App component
- Shared: Vue, vue-i18n
- Port: 3001

**Edit User App (Vue 3)**
- Exposes: App component
- Shared: Vue, vue-i18n
- Port: 3002

### State Management

The shell app uses Vue.observable for reactive state management:

```javascript
const store = Vue.observable({
  users: [],
  selectedUser: null,
  loading: false,
  error: null
})
```

### Event Communication

Apps communicate through an event bus and postMessage API:

```javascript
// Remote app requests user update via postMessage
window.parent.postMessage({
  type: 'UPDATE_USER',
  userId: 1,
  userData: { name: 'John Doe' }
}, '*')

// Shell app handles the request
eventBus.$on(EVENTS.UPDATE_USER_REQUEST, async ({ userId, userData }) => {
  // Handle update logic
})
```

## 🎯 Usage

### Navigation

1. **Home Page**: Overview and navigation to remote apps
2. **Users Page**: View all users with edit/delete actions (Vue 3 app in iframe)
3. **Edit User Page**: Create new users or edit existing ones (Vue 3 app in iframe)

### User Management

- **View Users**: See all users in a responsive table
- **Edit User**: Click edit button to modify user details
- **Delete User**: Remove users with confirmation

### Features

- **Isolated Execution**: Vue 3 apps run in separate iframes
- **Real-time Updates**: Changes reflect immediately across all apps
- **Form Validation**: Client-side validation with i18n error messages
- **Loading States**: Spinners and loading indicators
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Works on desktop and mobile devices
- **Cross-Origin Communication**: Secure iframe communication

## 🛠️ Development

### Adding New Features

1. **New Remote App**: Create new Vue 3 app with Module Federation
2. **New Routes**: Add routes to shell app router
3. **New State**: Extend store in shell app
4. **New Events**: Add event types to event bus
5. **Iframe Integration**: Update RemoteApp.vue to handle new app

### Building for Production

```bash
# Build all apps
cd shell-vue2 && npm run build
cd ../users-app-vue3 && npm run build
cd ../edit-user-app-vue3 && npm run build
```

### Testing

```bash
# Run linting
cd shell-vue2 && npm run lint
cd ../users-app-vue3 && npm run lint
cd ../edit-user-app-vue3 && npm run lint
```

## 🔍 Troubleshooting

### Common Issues

1. **Port Conflicts**: Ensure ports 3000, 3001, 3002 are available
2. **CORS Issues**: Module Federation config includes CORS headers
3. **Loading Failures**: Check that all apps are running
4. **Iframe Communication**: Verify postMessage API usage
5. **State Sync Issues**: Verify event bus communication

### Debug Mode

Enable webpack debug mode by adding to vue.config.js:

```javascript
configureWebpack: {
  devtool: 'source-map'
}
```

## 📚 Technologies Used

- **Vue 2.6.14**: Host shell application
- **Vue 3.2.13**: Remote applications
- **Vue Router 3.6.5**: Client-side routing
- **Vue I18n**: Internationalization
- **TypeScript**: Type safety in Vue 3 apps
- **Webpack 5**: Module Federation
- **Iframe API**: Cross-origin communication
- **PostMessage API**: Secure iframe communication
- **CSS3**: Modern styling with Flexbox/Grid

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎉 Acknowledgments

This project demonstrates modern approaches to integrating legacy Vue 2 applications with newer Vue 3 applications using iframe-based isolation and Module Federation for shared dependencies. 