const path = require('path')
const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const packageJson = require('./package.json')

module.exports = () => ({
  mode: 'production',
  entry: './index.umd.js',
  output: {
    path: path.resolve('dist'),
    library: {
      name: 'furaVue',
      type: 'umd',
      export: 'default'
    },
    filename: 'fura-vue.js'
  },
  externals: {
    vue: 'Vue'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.less$/,
        oneOf: [{
          resourceQuery: /module/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: { modules: true }
            },
            'less-loader'
          ]
        }, {
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: { esModule: false }
            },
            'less-loader'
          ]
        }]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'fura-vue.css'
    }),
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(packageJson.version)
    })
  ]
})
