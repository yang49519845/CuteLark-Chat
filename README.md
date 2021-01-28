
## 快速开发
前提:

* [Git](http://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
* [Meteor](https://www.meteor.com/install)

环境:

* window wsl2 (在wsl用户文件中clone项目)
* ubuntu
* Mac

> Meteor 自动给你装了 [NodeJS v12](https://nodejs.org/download/release/v12.18.4/) 和 [MongoDB v4.2](https://docs.mongodb.com/manual/introduction/) 。

clone仓库并执行命令:

```sh
git clone https://github.com/RocketChat/Rocket.Chat.git
cd Rocket.Chat
meteor npm install
meteor npm start
```

调试使用 [meteor debugging](https://docs.meteor.com/commandline.html#meteordebug). 用chrome新版浏览器:

```sh
meteor debug
```
有一个nodejs图标的开发控制台。

## 分支要求

参考 [Branches and Releases](https://rocket.chat/docs/developer-guides/branches-and-releases/)。

基于 [Gitflow Workflow](http://nvie.com/posts/a-successful-git-branching-model/)。
