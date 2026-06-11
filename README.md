# 知膳 FoodSense

智能饮食决策辅助系统：拍照识别菜品、个性化饮食建议、健康分析与对话助手「小膳青」。

> 本产品为健康管理辅助工具，不提供医疗诊断。功能说明见 [FUNCTIONAL_MODULES.md](./FUNCTIONAL_MODULES.md)。

---

## 环境要求

- **Node.js** 18+
- **npm** 9+

可选（打包移动端 / 桌面端）：

- [Android Studio](https://developer.android.com/studio) — 构建 Android APK
- Windows / macOS / Linux — 构建 Electron 桌面应用

---

## 快速开始

在项目根目录打开两个终端，分别启动后端与前端。

### 1. 安装依赖

```bash
# 后端
cd backend
npm install

# 前端（新开终端）
cd frontend
npm install
```

### 2. 配置环境变量（后端）

复制并编辑 `backend/.env`（若无此文件，在 `backend` 目录新建）：

```env
# 智谱 AI（聊天 + 拍照识别共用）
LLM_API_KEY=你的_api_key
LLM_BASE_URL=https://open.bigmodel.cn/api/paas/v4
LLM_MODEL=glm-4-flash
VISION_MODEL=glm-4v-flash
```

| 配置项 | 说明 |
|--------|------|
| `LLM_API_KEY` | 大模型 API Key（也可用 `ZHIPU_API_KEY` / `OPENAI_API_KEY`） |
| `LLM_BASE_URL` | API 地址，默认智谱 OpenAI 兼容端点 |
| `LLM_MODEL` | 聊天文本模型 |
| `VISION_MODEL` | 拍照识别视觉模型 |
| `PORT` | 后端端口，默认 `4001` |

**未配置 Key 时**：聊天降级为规则回复；拍照识别无法调用视觉模型。

### 3. 启动服务

```bash
# 终端 1 — 后端（默认 http://localhost:4001）
cd backend
npm start

# 终端 2 — 前端（默认 http://localhost:5173）
cd frontend
npm run dev
```

浏览器访问 **http://localhost:5173**。前端通过 Vite 代理将 `/api` 请求转发到后端 `4001` 端口。

### 4. 验证

- 后端健康检查：http://localhost:4001/api/ping
- 前端：注册账号 → 完成新手引导 → 首页拍照或进入小膳青聊天

---

## 常用命令

| 位置 | 命令 | 说明 |
|------|------|------|
| `backend/` | `npm start` | 启动 API 服务 |
| `backend/` | `npm run dev` | 使用 nodemon 热重载 |
| `frontend/` | `npm run dev` | 开发服务器 |
| `frontend/` | `npm run build` | 构建生产静态资源 |
| `frontend/` | `npm run electron:dev` | Electron 桌面开发模式 |
| `frontend/` | `npm run electron:build` | 打包桌面应用（输出 `dist_electron/`） |
| `frontend/` | `npm run android` | 构建并同步到 Capacitor Android 工程 |

---

## 打包说明

### 桌面应用（Electron）

```bash
cd frontend
npm install
npm run electron:dev      # 开发调试
npm run electron:build    # 生成 .exe 等安装包
```

### Android 应用（Capacitor）

1. 安装 Android Studio，并在 `frontend` 执行 `npm install`
2. 构建并打开 Android 工程：

```bash
cd frontend
npm run android
```

3. 在 Android Studio：**Build → Build Bundle(s) / APK(s) → Build APK(s)**
4. 调试包路径一般为：`android/app/build/outputs/apk/debug/app-debug.apk`

---

## 项目结构

```
FoodSense/
├── backend/          # Express + SQLite API
│   ├── server.js     # 路由入口
│   ├── foodVision.js # 拍照识别
│   ├── chatAssistant.js
│   ├── healthAnalytics.js
│   └── .env          # 环境变量（勿提交密钥）
├── frontend/         # React + Vite 前端
│   ├── src/
│   └── vite.config.ts
├── README.md         # 本文件
└── FUNCTIONAL_MODULES.md
```

---

## API 概览

后端默认地址：`http://localhost:4001`

| 分类 | 端点 |
|------|------|
| 健康检查 | `GET /api/ping` |
| 认证 | `POST /api/auth/register`、`POST /api/auth/login` |
| 用户资料 | `GET/POST /api/profile`、`POST /api/user` |
| 饮食记录 | `GET/POST /api/recipes` |
| 健康目标 | `GET/POST/DELETE /api/goals` |
| 饮食偏好 | `GET/POST/DELETE /api/preferences` |
| 健康分析 | `GET /api/health/summary`、`GET /api/health/profile` |
| 营养目标 | `GET /api/nutrition/targets` |
| 拍照识别 | `POST /api/analyze` |
| 聊天 | `GET /api/chat/messages`、`POST /api/chat` |
| 提醒设置 | `GET/POST /api/reminders/settings` |

用户数据存储在 `backend/foodsense.db`（SQLite，首次启动自动创建）。

---

## 常见问题

**前端能打开，但登录/识别失败**

- 确认后端已启动且 `4001` 端口未被占用
- 检查 `backend/.env` 中 API Key 是否有效

**拍照识别报错**

- 需配置 `LLM_API_KEY` 与 `VISION_MODEL`
- 换更清晰的照片重试；过暗或空白图会被前端拦截

**端口冲突**

- 修改 `backend/.env` 中 `PORT`，并同步更新 `frontend/vite.config.ts` 的 `proxy.target`

---

## 设计稿

UI 原型来源：[FoodSense Figma](https://www.figma.com/design/hF9UeIvqDGc6rC1rzZGKYZ/FoodSense-Android-App-Design)
