import express from 'express';
import cors from 'cors';
import compression from 'compression';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '@/configs/swagger.config';
import { errorMiddleware } from '@/middlewares/error.middleware';
import { requestTracingMiddleware, httpLoggerMiddleware } from '@/middlewares/logger.middleware';
import routes from '@/routes';
import { ENV } from '@/configs/env.config';

const app = express();

// 中间件
app.use(cors({
  origin: ENV.CORS_ORIGINS,
  methods: ENV.CORS_METHODS,
  allowedHeaders: ENV.CORS_HEADERS,
  credentials: true
}));

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求跟踪和日志中间件
app.use(requestTracingMiddleware);
app.use(httpLoggerMiddleware);

// 静态文件服务
// 从 UPLOADS_PATH 推导出文件系统目录路径（移除前导斜杠）
const uploadsPath = ENV.UPLOADS_PATH.replace(/^\/+/, ''); // 移除前导斜杠，如 /uploads -> uploads
const publicPath = ENV.PUBLIC_PATH.replace(/^\/+/, ''); // 移除前导斜杠，如 /public -> public
app.use(ENV.UPLOADS_PATH, express.static(path.join(process.cwd(), uploadsPath)));
app.use(ENV.PUBLIC_PATH, express.static(path.join(process.cwd(), publicPath)));

// API 文档
app.get(ENV.API_DOCS_JSON_PATH, (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
app.use(ENV.API_DOCS_PATH, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 路由
app.use(routes);

// 错误处理中间件
app.use(errorMiddleware);

export default app; 