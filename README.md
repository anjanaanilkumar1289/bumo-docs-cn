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

1. 在`website`目录下构建静态HTML页面，命令如下：

   ```shell
   npm run build 或者　　yarn run build
   ```

   此时，将在`website`目录下生成一个`build`文件夹，`build`文件夹下生成一个`bumo`文件夹。将根目录下的`codetabs.js`文件覆盖`bumo`文件夹下`js`文件夹下的`codetabs.js`文件即可。

   至此，`bumo`文件夹下就包含所有文档和其他页面中所含的 `.html` 文件。