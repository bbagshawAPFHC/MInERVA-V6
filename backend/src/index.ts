/**
 * This file serves as the entry point for the backend server.
 * It imports necessary dependencies, sets up middleware, connects to MongoDB,
 * defines routes, and starts the server.
 */

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import readOnlyRoutes from './routes/readOnlyRoutes';
import patientRoutes from './routes/patientRoutes';
import './models';
import connectDB from './config/db';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    
    // Routes
    app.use('/api', readOnlyRoutes);
    app.use('/api', patientRoutes);

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
};

startServer();

/**
 * Dynamically loads a model based on the provided modelName.
 * It tries different possible file names and returns the first model found.
 * If no model is found, it logs an error and returns null.
 *
 * @param modelName - The name of the model to load.
 * @returns The loaded model or null if no model is found.
 */
export const loadModel = (modelName: string) => {
  const possibleFileNames = [
    `${modelName}Model`,
    modelName,
    `${modelName.charAt(0).toUpperCase() + modelName.slice(1)}Model`,
    modelName.charAt(0).toUpperCase() + modelName.slice(1)
  ];

  for (const fileName of possibleFileNames) {
    try {
      const modelPath = path.join(__dirname, 'models', `${fileName}.ts`);
      const model = require(modelPath).default;
      if (model) {
        return model;
      }
    } catch (error) {
      // If the file doesn't exist or there's another error, continue to the next possible file name
      continue;
    }
  }

  console.error(`Error loading model ${modelName}: Model file not found`);
  return null;
};