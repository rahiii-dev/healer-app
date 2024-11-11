import express from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import yaml from 'js-yaml';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/database.js';
import environment from './config/environment.js';

const swaggerDocument = yaml.load(fs.readFileSync('./docs/swaager.yaml', 'utf8'));

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

// Example health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'API is healthy' });
});

// Start server
app.listen(environment.PORT, () => {
  console.log(`Server running on http://localhost:${environment.PORT}`);
  console.log(`Swagger docs available at http://localhost:${environment.PORT}/api-docs`);
});
