import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import taskRoutes from './routes/task.routes';
import commentRoutes from './routes/comment.routes';
import { errorHandler } from './middleware/error.middleware';
import { authenticate } from './middleware/auth.middleware';

const app = express();
export const prisma = new PrismaClient();
const PORT = process.env.PORT ?? 4003;

app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());

app.get('/health', (_req, res) =>
  res.json({ status: 'ok', service: 'task-service', timestamp: new Date().toISOString() })
);

app.use('/api/tasks', authenticate, taskRoutes);
app.use('/api/tasks', authenticate, commentRoutes);
app.use(errorHandler);

async function bootstrap() {
  await prisma.$connect();
  console.log('✅ Database connected');
  app.listen(PORT, () => console.log(`🚀 Task Service running on port ${PORT}`));
}

process.on('SIGTERM', async () => { await prisma.$disconnect(); process.exit(0); });
bootstrap().catch(console.error);
