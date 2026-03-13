import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import notificationRoutes from './routes/notification.routes';
import { errorHandler } from './middleware/error.middleware';
import { authenticate } from './middleware/auth.middleware';

const app = express();
export const prisma = new PrismaClient();
const PORT = process.env.PORT ?? 4004;

app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());

app.get('/health', (_req, res) =>
  res.json({ status: 'ok', service: 'notification-service', timestamp: new Date().toISOString() })
);

// Internal route (called by other services with service key)
app.use('/api/notifications', notificationRoutes);
app.use(errorHandler);

async function bootstrap() {
  await prisma.$connect();
  console.log('✅ Database connected');
  app.listen(PORT, () => console.log(`🚀 Notification Service running on port ${PORT}`));
}

process.on('SIGTERM', async () => { await prisma.$disconnect(); process.exit(0); });
bootstrap().catch(console.error);
