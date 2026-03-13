import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import userRoutes from './routes/user.routes';
import { errorHandler } from './middleware/error.middleware';
import { authenticate } from './middleware/auth.middleware';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT ?? 4002;

app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'user-service', timestamp: new Date().toISOString() });
});

app.use('/api/users', authenticate, userRoutes);
app.use(errorHandler);

async function bootstrap() {
  await prisma.$connect();
  console.log('✅ Database connected');
  app.listen(PORT, () => console.log(`🚀 User Service running on port ${PORT}`));
}

process.on('SIGTERM', async () => { await prisma.$disconnect(); process.exit(0); });

bootstrap().catch(console.error);

export { prisma };
