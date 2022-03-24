import path from 'path'
import { VueLoaderPlugin } from 'vue-loader'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

export default {
  mode: 'production',
  entry: './index.js',
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
    })
  ]
}
