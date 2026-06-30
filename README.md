# microBlog

基于 Express 5 + MongoDB + EJS 构建的轻量级微博客应用，灵感来源于《Node.js 开发指南》中的 MicroBlog 示例项目。

## 功能特性

- **用户注册 / 登录 / 登出** — 基于 `express-session` + `connect-mongo` 的会话管理
- **发布微博** — 登录用户可发表微博，首页展示最新内容
- **个人主页** — 按用户查看其发布的所有微博
- **安全防护** — Helmet 安全头、bcrypt 密码哈希、express-rate-limit 速率限制、express-validator 输入校验
- **Flash 消息** — 自定义中间件实现操作反馈提示
- **优雅关停** — 支持 SIGTERM / SIGINT 信号，安全关闭数据库连接与 HTTP 服务

## 技术栈

| 类别       | 技术                                      |
| ---------- | ----------------------------------------- |
| 后端框架   | Express 5                                 |
| 模板引擎   | EJS + express-ejs-layouts                |
| 数据库     | MongoDB（mongodb 驱动）                   |
| 会话存储   | express-session + connect-mongo           |
| 安全       | Helmet / bcrypt / express-rate-limit      |
| 输入校验   | express-validator                         |
| 环境变量   | dotenv                                    |
| 日志       | morgan + debug                            |

## 快速开始

### 前置条件

- [Node.js](https://nodejs.org/) (>= 18)
- [MongoDB](https://www.mongodb.com/) 本地或远程实例

### 安装与运行

```bash
# 克隆项目
git clone <repo-url>
cd microBlog

# 安装依赖
npm install

# 复制环境变量文件并按需修改
cp .env.example .env

# 启动服务
npm start
```

服务启动后访问 `http://localhost:3000`。

### 环境变量

| 变量             | 说明               | 默认值        |
| ---------------- | ------------------ | ------------- |
| `PORT`           | 服务端口           | `3000`        |
| `NODE_ENV`       | 运行环境           | `development` |
| `DB_HOST`        | MongoDB 主机       | `localhost`   |
| `DB_PORT`        | MongoDB 端口       | `27017`       |
| `DB_NAME`        | 数据库名称         | `microblog`   |
| `SESSION_SECRET` | 会话密钥（必填）   | —             |

> **注意**：生产环境部署时，务必将 `SESSION_SECRET` 设置为一个随机字符串，并确保 `NODE_ENV=production` 以启用安全 Cookie。

## 项目结构

```
microBlog/
├── bin/www.mjs            # 服务入口，HTTP 服务器与优雅关停
├── config/settings.mjs    # 集中配置（读取 .env）
├── controllers/
│   ├── authController.mjs # 注册 / 登录 / 登出逻辑
│   ├── pageController.mjs # 首页
│   └── postController.mjs # 微博发布与查询
├── middleware/
│   ├── auth.mjs           # 登录状态守卫
│   ├── errorHandler.mjs   # 404 与全局错误处理
│   ├── flash.mjs          # Flash 消息中间件
│   └── validator.mjs      # 请求参数校验规则
├── models/
│   ├── db.mjs             # MongoDB 连接管理
│   ├── post.mjs           # 微博数据模型
│   └── user.mjs           # 用户数据模型
├── routes/index.mjs       # 路由定义
├── views/                 # EJS 模板
├── public/                # 静态资源（Bootstrap / jQuery）
└── app.mjs                # Express 应用配置
```

## 路由一览

| 方法   | 路径        | 说明            | 需要登录 |
| ------ | ----------- | --------------- | -------- |
| GET    | `/`         | 首页（最新微博） | 否       |
| GET    | `/u/:user`  | 用户个人主页    | 否       |
| POST   | `/post`     | 发布微博        | 是       |
| GET    | `/reg`      | 注册页面        | 否       |
| POST   | `/reg`      | 提交注册        | 否       |
| GET    | `/login`    | 登录页面        | 否       |
| POST   | `/login`    | 提交登录        | 否       |
| GET    | `/logout`   | 登出            | 是       |

## License

ISC
