const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
      main: './src/main/index.js',
      domExample : './src/dom/dom-example.js'

  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },

    plugins: [

        new HtmlWebpackPlugin({
            template: './src/main/index.html',
            filename: 'index.html',
            chunks: ["main"]
        }),

        new HtmlWebpackPlugin({
            template: './src/dom/dom-exemple.html',
            filename: 'dom.html',
            chunks: ["domExample"]
        })
    ],

module: {
    rules: [
        {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader'
            ]
        },
        {
            test: /\.(png|svg|jpg|gif)$/,
            use: [
                'file-loader'
            ]
        }
    ]

    },
};