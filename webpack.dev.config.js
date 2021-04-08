const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js', 
  output: {
    path: __dirname + '/public',
    filename: 'tokyoryo-webapp-bundle.js'
  },
  module: {
    rules: [{
      test: /\.js[x]?$/,  // .jsxも対象に含む
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
            '@babel/preset-react' //ReactのPresetを追加
          ],
          plugins: ['@babel/plugin-syntax-jsx'] //JSXパース用
        }
      }
    },{
      test: /\.(sa|sc|c)ss$/,
      exclude: /node_modules/,
      use: [
        MiniCssExtractPlugin.loader, // style-loaderの代わり
        {
          loader: 'css-loader',
          options: { url: false }
        },
        'sass-loader'
      ]
    },{
      test: /\.css$/, use: 'css-loader'
    },]
  },
  plugins: [
    new MiniCssExtractPlugin({
        filename: 'tokyoryo-webapp-bundle.css',  // /dist/css/sample.cssに出力
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json']  // .jsxも省略可能対象にする
  }
};