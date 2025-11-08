// 📦 webpack.config.js — только для Bookshop
import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import * as sass from "sass";
import portfinder from "portfinder";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;
console.log(`🚀 Режим сборки: ${isDev ? "разработка" : "продакшн"}`);

export default async () => {
  const port = await portfinder.getPortPromise({ port: 8080 });

  return {
    mode: isDev ? "development" : "production",

    // 💡 Точка входа только для Bookshop
    entry: "./src/index.js",

    // 📤 Выход
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "bundle.[contenthash].js",
      assetModuleFilename: "assets/[hash][ext][query]",
      clean: true,
    },

    // 🔧 Загрузчики
    module: {
      rules: [
        { test: /\.pug$/, loader: "pug-loader", options: { pretty: true } },
        {
          test: /\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",

            {
              loader: "sass-loader",
              options: {
                implementation: sass,
                api: "modern-compiler", // ✅ новый API, без предупреждений
              },
            },
          ],
        },
        { test: /\.(png|jpg|jpeg|gif|svg)$/i, type: "asset/resource" },
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
      new HtmlWebpackPlugin({
        template: "./src/templates/index.pug",
        filename: "index.html",
      }),
      new HtmlWebpackPlugin({
        template: "./src/templates/cart.pug",
        filename: "cart/index.html",
      }),
      new MiniCssExtractPlugin({
        filename: isDev ? "styles.css" : "styles.[contenthash].css",
      }),
      new CopyWebpackPlugin({
        patterns: [{ from: "src/assets", to: "assets" }],
      }),
      new CleanWebpackPlugin(),
    ],

    // ⚙️ Оптимизация
    optimization: {
      minimize: isProd,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          terserOptions: { compress: { drop_console: true } },
        }),
      ],
    },

    // 🌍 DevServer
    devServer: {
      static: "./dist",
      hot: true,
      open: true,
      port,
    },

    resolve: { extensions: [".js", ".json"] },
  };
};
