import express from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/database.js';
import environment from './config/environment.js';

import { mergeSwaggerDocs } from './docs/swaggerDocs.js';
import notFoundHandler from './middlewares/notFoundMiddleware.js';
import errorHandler from './middlewares/errorHandlingMiddleware.js';

import authRoutes from './routers/authRoutes.js';
import adminRoutes from './routers/adminRoutes.js';
import userRoutes from './routers/userRoutes.js';
import requestRoutes from './routers/requestRoutes';

const swaggerDocument = mergeSwaggerDocs()

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Morgan Logger
if (environment.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'API is healthy' });
});

// routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/requests', requestRoutes);

// error
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(environment.PORT, () => {
  console.log(`Server running on http://localhost:${environment.PORT}`);
  console.log(`Swagger docs available at http://localhost:${environment.PORT}/api-docs`);
});
