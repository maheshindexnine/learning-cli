// #!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import readline from "readline";

const program = new Command();

program
  .name("file-writer")
  .description("CLI to create folders and write files")
  .version("1.0.0");

program
  .command("mkdir")
  .description("Create a folder")
  .argument("<folderName>", "Folder name")
  .action((folderName) => {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
      console.log(chalk.green(`Folder '${folderName}' created.`));
    } else {
      console.log(chalk.red(`Folder '${folderName}' already exists.`));
    }
  });

program
  .command("write")
  .description("Write content to a file")
  .argument("<filePath>", "File path")
  .argument("<content>", "Content to write")
  .action((filePath, content) => {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content);
    console.log(chalk.green(`File '${filePath}' created with content.`));
  });

program
  .command("read")
  .description("Read and display content of a file")
  .argument("<filePath>", "File path to read")
  .action((filePath) => {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf8");
      console.log(chalk.blue(`\n--- Content of ${filePath} ---\n`));
      console.log(content);
      console.log(chalk.blue("\n------------------------------\n"));
    } else {
      console.log(chalk.red(`File '${filePath}' does not exist.`));
    }
  });

const promptInput = async (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};

program
  .command("interactive-update")
  .description("Update file with prompt and see previous content")
  .argument("<filePath>", "File to update")
  .action(async (filePath) => {
    if (!fs.existsSync(filePath)) {
      console.log(chalk.red(`File '${filePath}' does not exist.`));
      return;
    }

    const currentContent = fs.readFileSync(filePath, "utf8");
    console.log(chalk.yellow(`\n--- Current content of ${filePath} ---\n`));
    console.log(currentContent);
    console.log(chalk.yellow("\n--------------------------------------\n"));

    const newContent = await promptInput(chalk.cyan("Enter new content: "));

    if (newContent.trim()) {
      fs.writeFileSync(filePath, newContent, "utf8");
      console.log(chalk.green("File updated successfully."));
    } else {
      console.log(chalk.gray("Update cancelled: No content provided."));
    }
  });

program.parse();
