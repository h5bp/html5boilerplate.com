const HtmlWebpackPlugin =  require('html-webpack-plugin');
module.exports = {
  mode : 'development',
  entry : './src/js/main.js',
  devServer: {
    liveReload: true,
    hot: true,
    open: true,
    static: ['./src/'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};