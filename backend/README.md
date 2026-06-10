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
- `POST /api/user` - 更新用户基础昵称
- `POST /api/profile` - 保存用户新手引导资料
- `GET /api/profile?email=...` - 查询用户资料
- `POST /api/recipes` - 保存用户食谱记录
- `GET /api/recipes?email=...` - 查询用户食谱记录
- `GET /api/goals?email=...` - 查询用户健康目标
- `POST /api/goals` - 保存用户健康目标
- `DELETE /api/goals?email=...&goal=...` - 删除用户健康目标
- `GET /api/preferences?email=...` - 查询用户饮食偏好
- `POST /api/preferences` - 保存用户饮食偏好
- `DELETE /api/preferences?email=...&preference=...` - 删除用户饮食偏好

The frontend is configured to proxy `/api` requests to `http://localhost:4001` in `frontend/vite.config.ts`.
