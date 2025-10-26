// 📦 webpack.config.js
import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import * as sass from "sass";
import portfinder from "portfinder";
import webpack from "webpack";

// 🧭 Определяем __dirname для ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🧰 Режим сборки
const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;
console.log(`🚀 Режим сборки: ${isDev ? "разработка" : "продакшн"}`);

// 🚀 Экспорт конфигурации
export default async () => {
  const port = await portfinder.getPortPromise({ port: 8080 });

  return {
    mode: isDev ? "development" : "production",

    // 💡 Точки входа
    entry: {
      main: "./src/index.js",
      brand: "./src/modules/brand.js",
    },

    // 📤 Выходные файлы
    output: {
      path: path.resolve("dist"),
      filename: "bundle.[contenthash].js",
      assetModuleFilename: "images/[name][ext]",
      publicPath: process.env.VERCEL ? "/" : "/bookshop/",
    },

    // 🔧 Загрузчики
    module: {
      rules: [
        {
          test: /\.pug$/,
          loader: "pug-loader",
          options: { pretty: true },
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader: "sass-loader",
              options: { implementation: sass },
            },
          ],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/i,
          type: "asset/resource",
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: { presets: ["@babel/preset-env"] },
          },
        },
      ],
    },

    // 💎 Плагины
    plugins: [
      new webpack.DefinePlugin({
        "process.env.VERCEL": JSON.stringify(process.env.VERCEL || false),
      }),

      new HtmlWebpackPlugin({
        template: "./src/templates/index.pug",
        filename: "index.html",
        chunks: ["main"],
        templateParameters: {
          vercel: !!process.env.VERCEL, // 👈 передаём флаг
        },
      }),
      new HtmlWebpackPlugin({
        template: "./src/templates/cart.pug",
        filename: "cart/index.html",
        chunks: ["main"],
        templateParameters: {
          vercel: !!process.env.VERCEL, // 👈 передаём флаг
        },
      }),
      new HtmlWebpackPlugin({
        template: "./src/templates/brand.pug",
        filename: "brand/index.html",
        chunks: ["brand"],
        templateParameters: {
          vercel: !!process.env.VERCEL, // 👈 передаём флаг сюда
        },
      }),
      new MiniCssExtractPlugin({
        filename: isDev ? "styles.css" : "styles.[contenthash].css",
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: "src/assets", to: "assets" },
          { from: "brand/assets", to: "brand/assets" },
        ],
      }),
      new CleanWebpackPlugin(),
    ],

    // ⚙️ Оптимизация
    optimization: {
      minimize: isProd,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            compress: { drop_console: true },
            output: { comments: false },
          },
        }),
      ],
      splitChunks: { chunks: "all" },
    },

    // 🌍 DevServer
    devServer: {
      static: "./dist",
      hot: true,
      open: true,
      port,
    },

    resolve: { extensions: [".js", ".json"] },
    ignoreWarnings: [/Deprecation/],
  };
};
