import express from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import morgan from 'morgan';
import { Server } from 'socket.io';
import { createServer } from 'http';

import connectDB from './config/database.js';
import environment from './config/environment.js';
import { mergeSwaggerDocs } from './docs/swaggerDocs.js';
import notFoundHandler from './middlewares/notFoundMiddleware.js';
import errorHandler from './middlewares/errorHandlingMiddleware.js';

import authRoutes from './routers/authRoutes.js';
import adminRoutes from './routers/adminRoutes.js';
import userRoutes from './routers/userRoutes.js';
import requestRoutes from './routers/requestRoutes.js';
import slotRoutes from './routers/slotRoutes.js';
import appointmentRoutes from './routers/appointmentRoutes.js';
import paymentRoutes from './routers/paymentRoutes.js';
import chatRoutes from './routers/chatRoutes.js';

import { socket } from './socket/routes.js'; 
import { connectRedis } from './config/redis.js';

const app = express();
const server = createServer(app);

// Swagger documentation
const swaggerDocument = mergeSwaggerDocs();

// Connect to database
connectDB();
connectRedis();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(
  morgan(environment.NODE_ENV === 'development' ? 'dev' : 'combined')
);

// Setup Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'API is healthy' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/appointment', appointmentRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/chats', chatRoutes);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', 
  },
});

io.on('connection', socket); 

// Start the server
server.listen(environment.PORT, () => {
  console.log(`Server running on http://localhost:${environment.PORT}`);
  console.log(`Swagger docs available at http://localhost:${environment.PORT}/api-docs`);
});
