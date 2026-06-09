# FoodSense Backend

This backend provides a simple Express API with SQLite storage for user authentication and profile data.

## Install

```bash
cd backend
npm install
```

## Run

```bash
npm start
```

## API

- `POST /api/auth/register` - 注册用户
- `POST /api/auth/login` - 登录用户
- `POST /api/profile` - 保存用户新手引导资料
- `GET /api/profile?email=...` - 查询用户资料

The frontend is configured to proxy `/api` requests to `http://localhost:4000` in `frontend/vite.config.ts`.
