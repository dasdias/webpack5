const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const mode = process.env.NODE_ENV || 'development';
// определяем какая будет компиляция web по умолчанию
// browserslist для определённой среды
const target = mode === 'development' ? 'web' : 'browserslist';
// если сборка в dev режиме то включаем карту
// разработки иначе карту не подключаем
const devtool = mode === 'development' ? 'source-map' : undefined;
module.exports = {
  mode,
  target,
  devtool,
  devServer: {
    hot: true, // автоматическая перезагрузка сервера
  },
  entry: ['@babel/polyfill', './src/index.js'], // входящий файл
  output: {
    // исходящий файл создаётся автоматически с добавлением хеша
    filename: '[name][contenthash].js',
    // filename: 'index.js', // исходящий файл
    path: path.resolve(__dirname, 'dist'), // получаем путь к текущей директории
    clean: true, // очищаем папку dist
    // добавляем хеш к файлам ресурсов
    assetModuleFilename: 'assets/[hash][ext][query]',
  },
  plugins: [
    new HtmlWebpackPlugin({ // собираем html
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name][contenthash].css',
    }), // подключаем css
  ],
  module: { // описываем правила для работы со стилями
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader', // указываем тип ресурсов
      },
      {
        test: /\.(sa|sc|c)ss$/i, // определяем к каким файлам применяем правила
        use: [
          // обработка идет с конца
          MiniCssExtractPlugin.loader, // обрабатывает css и минифицирует его
          'css-loader', // позволяет загружать css в js
          'postcss-loader', // добавляем префиксы
          'sass-loader', // обрабатываем sass файлы
        ],
      },
      {
        test: /\.(jpg|jpeg|png|svg|gif)/i,
        type: 'asset/resource', // указываем тип ресурсов
      },
      {
        test: /\.(woff2|woff|eot|ttf|otf)/i,
        type: 'asset/resource',
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/, // исключаем папку node_modules
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
    ],
  },
};
