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

// 🧭 Определяем __dirname для ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🧰 Получаем режим сборки (development или production)
const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

console.log(`🚀 Режим сборки: ${isDev ? "разработка" : "продакшн"}`);

// 🚀 Экспорт конфига как асинхронная функция
export default async () => {
  // 🧠 Ищем свободный порт, начиная с 8080
  const port = await portfinder.getPortPromise({ port: 8080 });

  return {
    mode: isDev ? "development" : "production",

    // entry
    entry: {
      main: "./src/index.js",
      brand: "./src/modules/brand.js", // 💎 добавляем точку входа для brand
    },

    output: {
      path: path.resolve("dist"),
      filename: "bundle.[contenthash].js",
      assetModuleFilename: "images/[name][ext]",
    },

    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader: "sass-loader",
              options: {
                implementation: sass,
              },
            },
          ],
        },
        {
          test: /\.pug$/,
          loader: "pug-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: "asset/resource",
        },
      ],
    },

    // ↓ ниже, в разделе plugins:
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/templates/index.pug",
        filename: "index.html",
        chunks: ["main"], // подключаем только основной JS
      }),
      new HtmlWebpackPlugin({
        template: "./src/templates/cart.pug",
        filename: "cart/index.html",
        chunks: ["main"],
      }),
      new HtmlWebpackPlugin({
        template: "./src/templates/brand.pug", // 🔥 новый шаблон
        filename: "brand/index.html",
        chunks: ["brand"], // подключаем brand.js + стили
      }),
      // остальные плагины (CopyPlugin, CleanWebpackPlugin и т.д.)

      new MiniCssExtractPlugin({
        filename: isDev ? "styles.css" : "styles.[contenthash].css",
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: "src/assets", to: "assets" },
          { from: "brand/assets/favicon.png", to: "favicon.png" },
        ],
      }),
    ],

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

    devServer: {
      static: "./dist",
      hot: true,
      open: true,
      port, // 🌟 теперь автоматически найденный порт
    },

    resolve: { extensions: [".js", ".json"] },
    stats: { warningsFilter: [/Deprecation/] },
  };
};
