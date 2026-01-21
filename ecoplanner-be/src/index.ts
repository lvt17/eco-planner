import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { config } from './config';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { setupSocketHandlers } from './socket/handlers';
import authRoutes from './controllers/auth';
import productRoutes from './controllers/products';
import chatRoutes from './controllers/chat';
import adminRoutes from './controllers/admin';
import orderRoutes from './controllers/orders';
import paymentRoutes from './controllers/payment';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: config.frontendUrl, methods: ['GET', 'POST'], credentials: true },
});

setupSocketHandlers(io);

app.use(helmet());
app.use(cors({ origin: config.frontendUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/', rateLimit({ windowMs: config.rateLimit.windowMs, max: config.rateLimit.maxRequests, message: { error: 'Too many requests' } }));

app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

// Only start server when not in test mode
if (process.env.NODE_ENV !== 'test') {
    httpServer.listen(config.port, () => {
        console.log(`🌿 EcoPlanner API running on http://localhost:${config.port}`);
    });
}

export { app, httpServer, io };
