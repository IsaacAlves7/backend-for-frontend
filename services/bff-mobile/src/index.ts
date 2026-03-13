import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();
const PORT = process.env.PORT ?? 3002;

app.use(helmet());
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PATCH', 'DELETE'] }));
app.use(morgan('combined'));
app.use(express.json({ limit: '5mb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300, standardHeaders: true }));

app.get('/health', (_req, res) =>
  res.json({ status: 'ok', service: 'bff-mobile', timestamp: new Date().toISOString() })
);

app.use('/api', routes);
app.use(errorHandler);

app.listen(PORT, () => console.log(`📱 BFF Mobile running on port ${PORT}`));
