// Bootstrap function for Module Federation
async function bootstrap() {
  const { createApp } = await import('vue')
  const App = await import('./App.vue')

  // Check if we're in standalone mode or federated mode
  const app = createApp(App.default)
  
  // If we're in standalone mode, mount the app
  if (document.getElementById('app')) {
    app.mount('#app')
  }
}

// Start the application
bootstrap() 