## 概述

欢迎来到 BUMO 文档中心，这里有全面的文档，包括 API 接口、开发指南、使用手册等，以便帮助您快速使用 BUMO；同时，在您遇到问题时，我们还提供技术支持。

## 环境

您必须拥有 Node >= 8.x 和 Yarn >= 1.5。

## 安装

1. 下载安装包
1. 解压缩安装包
1. 进入`website`目录，并下载依赖库，命令如下：

   ```shell
   cd website
   npm install
   ```
1. 在`website`目录下启动项目，命令如下：

   ```shell
   npm start 或 yarn start
   ```

   修改端口号（如8080端口）的启动命令，如下：
   ```shell
   npm run start -- --port 8080 或 yarn run start --port 8080
   ```