import figlet from "figlet";
import chalk from "chalk";

console.clear();

console.log(
  chalk.magentaBright(
    figlet.textSync("Oleg & Neuro", { horizontalLayout: "default" })
  )
);

console.log(chalk.cyanBright("💎  Code Studio — Brand Kit Ready!"));
console.log(chalk.green("🚀  Running on http://localhost:8085"));
console.log(chalk.yellow("✨  Crafted with ❤️  by Oleg & Neuro"));
console.log("\n");
