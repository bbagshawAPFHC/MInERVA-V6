import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import readOnlyRoutes from './routes/readOnlyRoutes';
import patientRoutes from './routes/patientRoutes';
import fileRoutes from './routes/fileRoutes';
import connectDB from './config/db';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api', readOnlyRoutes);
app.use('/api', patientRoutes);
app.use('/api', fileRoutes);

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
};

startServer();

// Model loader function
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