var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');

module.exports = {
   target: 'node',
  mode: "production",
  context: __dirname,
  devtool: 'source-map',
  entry: "./script.js",
  optimization: {
    minimize: false
  },
  output: {
    path: __dirname,
    filename: "script.min.js"
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],
};

module: {
  rules: [
    {
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }
  ]
}