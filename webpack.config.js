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

    entry: "./src/index.js",
    output: {
      path: path.resolve("dist"),
      filename: "bundle.[contenthash].js",
      assetModuleFilename: "images/[name][ext]",
    },

    module: {
      rules: [
        { test: /\.pug$/, use: ["pug-loader"] },
        { test: /\.js$/, exclude: /node_modules/, use: ["babel-loader"] },
        {
          test: /\.(scss|css)$/,
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
          test: /\.(png|jpe?g|gif|svg|ico)$/i,
          type: "asset/resource",
          generator: { filename: "images/[name][ext]" },
        },
      ],
    },

    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: "./src/templates/index.pug",
        filename: "index.html",
        favicon: path.resolve(__dirname, "brand/assets/favicon.png"),
        minify: isProd
          ? { collapseWhitespace: true, removeComments: true }
          : false,
      }),

      new HtmlWebpackPlugin({
        template: "./src/templates/brand.pug",
        filename: "brand/index.html",
      }),

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
