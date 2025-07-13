const { defineConfig } = require('@vue/cli-service')
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new ModuleFederationPlugin({
        name: 'editUserApp',
        filename: 'remoteEntry.js',
        exposes: {
          './App': './src/App.vue'
        },
        shared: {
          vue: {
            singleton: true,
            requiredVersion: '^3.2.13'
          },
          'vue-i18n': {
            singleton: true,
            requiredVersion: '^9.1.9'
          }
        }
      })
    ]
  },
  devServer: {
    port: 3002,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
}) 