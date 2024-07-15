// src/utils/modelLoader.ts

import mongoose from 'mongoose';
import path from 'path';

export async function loadModel(modelName: string) {
  try {
    return mongoose.model(modelName);
  } catch (error) {
    // If the model doesn't exist, try to load it
    const modelPath = path.join(__dirname, '..', 'models', `${modelName}Model.ts`);
    await import(modelPath);
    return mongoose.model(modelName);
  }
}