---
title: node.js开发cli工具
date: 2026-04-16
tags:
  - 前端
  - cli
---

## node.js可以用来开发cli应用，如create vite、create-react-app等

在日常的前端开发中，我们经常会接触到各种脚手架和命令行工具（CLI，Command Line Interface）。无论是用于初始化项目的 `create-vite`，还是构建打包工具 `webpack-cli`，它们都是通过 Node.js 来实现的。

开发属于自己的 CLI 工具，不仅可以沉淀团队的代码规范和工程化最佳实践，还能大幅提升日常开发效率。本文将带你从零开始，一步步实现一个简单的 Node.js CLI 工具。

### 一、常用工具库推荐

在开发 CLI 时，我们通常会用到以下几个主流的开源库，它们能帮助我们快速处理各种终端交互：

- **`commander`**：用于解析命令行参数（如 `-v`, `--help` 等）。
- **`inquirer` / `prompts`**：用于实现终端交互式问答（如让用户选择项目模板、输入项目名称）。
- **`chalk`** / **`picocolors`**：用于在终端输出带有颜色的文字。
- **`ora`**：用于显示终端的 loading 动画效果。
- **`download-git-repo`**：用于从 Git 仓库下载模板代码。

### 二、从零搭建 CLI 工具

#### 1. 初始化项目

首先创建一个空目录并初始化 `package.json`：

```bash
mkdir my-cli
cd my-cli
npm init -y
```

#### 2. 配置可执行文件

在项目中创建一个 `bin/index.js` 文件。注意文件顶部必须添加 **Shebang（解释器指令）**：

```javascript
#!/usr/bin/env node

console.log("Hello, my-cli!");
```

`#!/usr/bin/env node` 的作用是告诉操作系统，用系统环境变量中找到的 `node` 来执行这个文件。

接着，修改 `package.json`，添加 `bin` 字段：

```json
{
  "name": "my-cli",
  "version": "1.0.0",
  "bin": {
    "my-cli": "./bin/index.js"
  }
}
```

为了在本地测试我们的 CLI，我们可以运行：

```bash
npm link
```

这会将 `my-cli` 软链接到全局。此时在终端输入 `my-cli`，就能看到 `Hello, my-cli!` 的输出了。

### 三、丰富 CLI 功能：解析参数与交互

#### 1. 安装依赖

我们先安装 `commander` 和 `inquirer`：

```bash
npm install commander inquirer
```

#### 2. 编写核心逻辑

修改 `bin/index.js`，加入版本号查询和创建项目的指令：

```javascript
#!/usr/bin/env node

import { program } from "commander";
import inquirer from "inquirer";
import fs from "fs";

// 读取 package.json 获取版本号
const packageJson = JSON.parse(
  fs.readFileSync(new URL("../package.json", import.meta.url)),
);

// 1. 配置版本号
program.version(packageJson.version);

// 2. 配置 create 命令
program
  .command("create <project-name>")
  .description("创建一个新的项目")
  .action(async (projectName) => {
    console.log(`准备创建项目: ${projectName}`);

    // 3. 交互式问答
    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "template",
        message: "请选择你想要使用的框架模板：",
        choices: ["Vue3", "React", "Svelte"],
      },
      {
        type: "confirm",
        name: "useTypeScript",
        message: "是否使用 TypeScript？",
        default: true,
      },
    ]);

    console.log("\n你的选择是：");
    console.log(answers);

    // TODO: 根据用户的选择，下载对应的模板到 projectName 文件夹中
    console.log("\n模板下载完成！");
  });

// 解析命令行参数
program.parse(process.argv);
```

_(注意：新版 inquirer 和一些生态工具推荐使用 ESM，因此你需要在 `package.json` 中配置 `"type": "module"` 以支持 ES Module 语法。)_

#### 3. 测试效果

在终端执行：

```bash
my-cli create my-app
```

你将看到版本号、命令帮助信息，以及交互式的问答流程，让用户选择 Vue3 / React 等模板。

### 四、总结

以上只是一个简单的起步。在实际的工程化场景中，你可以继续扩展以下功能：

1. **集成模板拉取**：根据用户的选择，通过 `download-git-repo` 自动拉取远端模板，或者直接将模板代码放在本地进行文件拷贝。
2. **自动安装依赖**：通过 `child_process` 自动帮用户在新项目目录下执行 `npm install`。
3. **更好的终端体验**：使用 `picocolors` 和 `ora` 在控制台打印带颜色和动画的进度提示，让 CLI 工具更加专业。

掌握 Node.js 开发 CLI，是迈向前端工程化不可或缺的一环。动手试一试，打造属于你们团队的专属脚手架吧！
