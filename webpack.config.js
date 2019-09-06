const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
              sourceMap: true,
              importLoaders: 2,
              url: false,
            // import: false
          }
            }

            
        ]
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
            'file-loader',
            {
              loader: 'image-webpack-loader',
              options: {
              bypassOnDebug: true,
              disable: true,
      },
    },
        ]
      }
    ]
  }
};