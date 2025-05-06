#!/usr/bin/env node

import inquirer from "inquirer";
import fs from "fs";
import chalk from "chalk";
import ora from "ora";
import boxen from "boxen";
import gradient from "gradient-string";

// Fancy welcome banner
console.log(
  boxen(gradient.pastel("🔥 Welcome to Monster CLI 🔥"), {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: "magenta",
  })
);

const actions = {
  CREATE_FOLDER: "📁 Create Folder",
  CREATE_FILE: "📄 Create File",
  READ_FILE: "📖 Read File",
  WRITE_FILE: "✍️ Write File",
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "Choose an action:",
      choices: Object.values(actions),
    },
  ]);

  switch (action) {
    case actions.CREATE_FOLDER: {
      const { folderName } = await inquirer.prompt({
        type: "input",
        name: "folderName",
        message: "Enter folder name:",
      });

      const spinner = ora("Creating folder...").start();
      await delay(5000); // 10 seconds delay

      if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName, { recursive: true });
        spinner.succeed(chalk.green(`Folder '${folderName}' created.`));
      } else {
        spinner.fail(chalk.red(`Folder '${folderName}' already exists.`));
      }
      break;
    }

    case actions.CREATE_FILE: {
      const { filePath } = await inquirer.prompt({
        type: "input",
        name: "filePath",
        message: "Enter file path (e.g., folder/file.txt):",
      });

      const spinner = ora("Creating file...").start();
      await delay(5000); // 10 seconds delay

      fs.writeFileSync(filePath, "", "utf8");
      spinner.succeed(chalk.green(`File '${filePath}' created.`));
      break;
    }

    case actions.READ_FILE: {
      const { readPath } = await inquirer.prompt({
        type: "input",
        name: "readPath",
        message: "Enter file path to read:",
      });

      const spinner = ora("Reading file...").start();
      await delay(5000); // 10 seconds delay

      if (fs.existsSync(readPath)) {
        const content = fs.readFileSync(readPath, "utf8");
        spinner.stop();
        console.log(
          chalk.yellow(
            `\n----- 📄 Content of ${readPath} -----\n${content}\n------------------------------\n`
          )
        );
      } else {
        spinner.fail(chalk.red("File not found."));
      }
      break;
    }

    case actions.WRITE_FILE: {
      const { writePath, content } = await inquirer.prompt([
        {
          type: "input",
          name: "writePath",
          message: "Enter file path to write to:",
        },
        {
          type: "input",
          name: "content",
          message: "Enter content:",
        },
      ]);

      const spinner = ora("Writing to file...").start();
      await delay(5000); // 10 seconds delay

      fs.writeFileSync(writePath, content, "utf8");
      spinner.succeed(chalk.green(`Content written to '${writePath}'.`));
      break;
    }

    default:
      console.log(chalk.red("Unknown action."));
  }
}

main();
