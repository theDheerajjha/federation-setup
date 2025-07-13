const { defineConfig } = require('@vue/cli-service')
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new ModuleFederationPlugin({
        name: 'shell',
        filename: 'remoteEntry.js',
        remotes: {
          usersApp: 'usersApp@http://localhost:3001/remoteEntry.js',
          editUserApp: 'editUserApp@http://localhost:3002/remoteEntry.js'
        },
        exposes: {
          './store': './src/store/index.js',
          './i18n': './src/i18n/index.js',
          './eventBus': './src/utils/eventBus.js',
          './eventHelpers': './src/utils/eventBus.js'
        },
        shared: {
          vue: {
            singleton: true,
            requiredVersion: '^2.6.14'
          },
          'vue-i18n': {
            singleton: true,
            requiredVersion: '^8.28.2'
          }
        }
      })
    ]
  },
  devServer: {
    port: 3000,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
})
