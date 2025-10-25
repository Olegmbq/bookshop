import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import portfinder from "portfinder";
import chalk from "chalk";

const __dirname = path.resolve();

const config = {
  mode: "development",

  // 🎯 Точка входа
  entry: "./brand/index.js",

  // 📦 Куда собирать
  output: {
    path: path.resolve(__dirname, "dist/brand"),
    filename: "brand.bundle.[contenthash].js",
    clean: true,
  },

  // 🔧 Модули и загрузчики
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.(scss|css)$/i,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              api: "modern-compiler", // 🧠 Новый API для Dart Sass
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/[name][hash][ext]",
        },
      },
    ],
  },

  // 🌈 Плагины
  plugins: [
    new HtmlWebpackPlugin({
      template: "./brand/index.html",
      filename: "index.html",
      favicon: "./brand/assets/favicon.ico",
    }),
  ],

  // 🌍 Сервер разработки
  devServer: {
    static: {
      directory: path.resolve(__dirname, "brand"),
    },
    open: true,
    hot: true,
    host: "localhost",
    port: 8085,
  },
};

// 🎨 Автоматический выбор свободного порта + красивый баннер
export default async () => {
  const port = await portfinder.getPortPromise({ port: 8085 });
  config.devServer.port = port;

  console.clear();
  console.log(
    chalk.magentaBright.bold(`
╔════════════════════════════════════════════════╗
║ 💎  Oleg & Neuro Code Studio — Brand Kit Ready ║
╠════════════════════════════════════════════════╣
║ 🚀 Running at: http://localhost:${port}               
║ ✨ Crafted with Love by Oleg & Neuro 💖
╚════════════════════════════════════════════════╝
  `)
  );

  return config;
};
