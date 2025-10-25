// 💎 Oleg & Neuro Code Studio — Smart Dependency Checker + Neon Intro v4

import { execSync } from "child_process";
import fs from "fs";
import chalk from "chalk";
import path from "path";

// 🔧 Все необходимые пакеты
const requiredDeps = [
  "webpack",
  "webpack-cli",
  "webpack-dev-server",
  "html-webpack-plugin",
  "clean-webpack-plugin",
  "copy-webpack-plugin",
  "mini-css-extract-plugin",
  "sass",
  "sass-loader",
  "css-loader",
  "style-loader",
  "babel-loader",
  "@babel/core",
  "@babel/preset-env",
  "pug",
  "pug-loader",
  "chalk",
  "portfinder",
  "html-loader",
];

// 🧠 Проверка зависимостей
console.log(chalk.cyanBright("\n🔍 Checking project dependencies...\n"));

let missing = [];

for (const dep of requiredDeps) {
  try {
    require.resolve(dep);
  } catch {
    missing.push(dep);
  }
}

if (missing.length > 0) {
  console.log(chalk.yellow("⚠️  Missing dependencies detected:\n"));
  console.log(missing.map((d) => " - " + d).join("\n"));

  const command = `npm install --save-dev ${missing.join(" ")}`;
  console.log(
    chalk.magentaBright(`\n🚀 Installing missing packages...\n${command}\n`)
  );

  try {
    execSync(command, { stdio: "inherit" });
    console.log(
      chalk.greenBright("\n✅ All dependencies successfully installed!\n")
    );
  } catch (err) {
    console.error(
      chalk.redBright("\n❌ Installation failed! Please install manually:\n"),
      command
    );
    process.exit(1);
  }
} else {
  console.log(chalk.greenBright("✨ All dependencies are up to date!\n"));
}

// 💡 Создание main.scss, если его нет
const brandStylePath = "./brand/assets/styles/main.scss";
if (!fs.existsSync(brandStylePath)) {
  fs.mkdirSync("./brand/assets/styles", { recursive: true });
  fs.writeFileSync(
    brandStylePath,
    "/* 🌈 Auto-created main.scss */\nbody { background: #0a0014; }"
  );
  console.log(chalk.blueBright(`🧩 Created missing file: ${brandStylePath}\n`));
}

// ⚡ Эффект неонового включения
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function flickerEffect(line, color, flickers = 3) {
  for (let i = 0; i < flickers; i++) {
    process.stdout.write(color.dim(line) + "\r");
    await sleep(100 + Math.random() * 100);
    process.stdout.write(" ".repeat(line.length) + "\r");
    await sleep(80 + Math.random() * 120);
  }
  console.log(color(line));
}

async function neonPrint(text, color) {
  for (const char of text) {
    process.stdout.write(color(char));
    await sleep(8 + Math.random() * 22);
  }
  process.stdout.write("\n");
}

async function showBanner() {
  const currentPath = process.cwd();
  let projectName = "";
  let port = "";
  let color = chalk.magentaBright;

  if (currentPath.includes("brand")) {
    projectName = "💎  Oleg & Neuro Code Studio — Brand Kit Ready";
    port = "8085";
    color = chalk.magentaBright;
  } else {
    projectName = "📚  Oleg & Neuro Code Studio — Bookshop SPA Ready";
    port = "8080";
    color = chalk.cyanBright;
  }

  console.clear();
  await flickerEffect("⚡ Booting up Neon Engine...", color, 2);
  await sleep(400);

  await neonPrint(
    "╔════════════════════════════════════════════════════════════════╗",
    color
  );
  await neonPrint(`║ ${projectName.padEnd(60, " ")}║`, color);
  await neonPrint(
    "╠════════════════════════════════════════════════════════════════╣",
    color
  );
  await neonPrint(
    `║ 🚀  Running at: http://localhost:${port.padEnd(41, " ")}║`,
    color
  );
  await neonPrint(
    "║ ✨  Crafted with Love by Oleg & Neuro 💖                     ║",
    color
  );
  await neonPrint(
    "╚════════════════════════════════════════════════════════════════╝",
    color
  );
  console.log("\n");
}

// 🔥 Запуск
showBanner();
