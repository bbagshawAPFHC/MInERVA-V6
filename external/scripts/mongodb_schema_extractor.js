const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const cliProgress = require('cli-progress');

async function generateSchema(uri, dbName) {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();
    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    progressBar.start(collections.length, 0);

    for (const collection of collections) {
      const samples = await db.collection(collection.name).find().limit(limit).toArray();
      if (samples.length > 0) {
        const schema = samples.reduce((acc, doc) => {
          const docSchema = extractSchema(doc);
          return mergeSchemas(acc, docSchema);
        }, {});
        generateTypeScriptModel(collection.name, schema);
        generateRouteFile(collection.name);
        generateControllerFile(collection.name);
      } else {
        console.log(`Collection ${collection.name} is empty.`);
      }
      progressBar.increment();
    }
    progressBar.stop();
  } finally {
    await client.close();
  }
}

function extractSchema(doc, parentKey = '') {
  const schema = {};
  for (const key in doc) {
    if (doc.hasOwnProperty(key)) {
      const value = doc[key];
      if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
        schema[key] = extractSchema(value, `${parentKey}${key}.`);
      } else {
        schema[key] = typeof value === 'object' && value instanceof Date ? 'date' : typeof value;
      }
    }
  }
  return schema;
}

function mergeSchemas(schema1, schema2) {
  const mergedSchema = { ...schema1 };
  for (const key in schema2) {
    if (schema2.hasOwnProperty(key)) {
      if (!mergedSchema[key]) {
        mergedSchema[key] = schema2[key];
      } else if (typeof mergedSchema[key] === 'object' && typeof schema2[key] === 'object' && !Array.isArray(mergedSchema[key]) && !Array.isArray(schema2[key])) {
        mergedSchema[key] = mergeSchemas(mergedSchema[key], schema2[key]);
      } else {
        mergedSchema[key] = 'mixed';
      }
    }
  }
  return mergedSchema;
}

function generateTypeScriptModel(collectionName, schema) {
  const modelName = `${capitalize(collectionName)}Model`;
  const fileName = `models/${modelName}.ts`;

  const { interfaceFields, mongooseFields } = generateFieldsAndSchemas(schema);

  let content = `import mongoose, { Schema, Document } from 'mongoose';\n\n`;
  content += `interface ${capitalize(collectionName)} extends Document {\n${interfaceFields}}\n\n`;
  content += `const ${capitalize(collectionName)}Schema: Schema = new Schema({\n${mongooseFields}}, { collection: '${collectionName}' });\n\n`;
  content += `const ${modelName} = mongoose.model<${capitalize(collectionName)}>('${capitalize(collectionName)}', ${capitalize(collectionName)}Schema);\n\n`;
  content += `export default ${modelName};`;

  fs.writeFileSync(path.join(__dirname, fileName), content.trim(), 'utf8');
  console.log(`Generated ${fileName}`);
}

function generateRouteFile(collectionName) {
  const routeName = `routes/${collectionName}Routes.ts`;
  const controllerName = `${collectionName}Controller`;

  const content = `import express from 'express';
import { getAllPatientData } from '../controllers/${controllerName}';

const router = express.Router();

router.get('/${collectionName}/:id', getAllPatientData);

export default router;`;

  fs.writeFileSync(path.join(__dirname, routeName), content.trim(), 'utf8');
  console.log(`Generated ${routeName}`);
}

function generateControllerFile(collectionName) {
  const controllerName = `controllers/${collectionName}Controller.ts`;

  const content = `import { Request, Response } from 'express';
import mongoose from 'mongoose';

export const getAllPatientData = async (req: Request, res: Response) => {
  try {
    const patientId = req.params.id;
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const results: { [key: string]: any } = {};

    for (const collection of collections) {
      const col = db.collection(collection.name);
      const documents = await col.find({ "patientdetails.athenapatientid": patientId }).toArray();
      if (documents.length > 0) {
        results[collection.name] = documents;
      }
    }

    if (Object.keys(results).length === 0) {
      return res.status(404).json({ message: 'Patient data not found in any collection' });
    }

    res.status(200).json(results);
  } catch (error: any) {
    console.error('Error fetching patient data:', error);
    res.status(500).json({ message: error.message });
  }
};`;

  fs.writeFileSync(path.join(__dirname, controllerName), content.trim(), 'utf8');
  console.log(`Generated ${controllerName}`);
}

function generateFieldsAndSchemas(schema, indent = 0) {
  let interfaceFields = '';
  let mongooseFields = '';

  const interfaceIndent = ' '.repeat(indent + 2);
  const mongooseIndent = ' '.repeat(indent + 2);

  for (const key in schema) {
    if (key === '_id') continue; // Skip the _id field

    const type = schema[key];

    if (typeof type === 'object' && !Array.isArray(type)) {
      const { interfaceFields: nestedInterfaceFields, mongooseFields: nestedMongooseFields } = generateFieldsAndSchemas(type, indent + 2);
      interfaceFields += `${interfaceIndent}${key}: {\n${nestedInterfaceFields}${interfaceIndent}};\n`;
      mongooseFields += `${mongooseIndent}${key}: {\n${nestedMongooseFields}${mongooseIndent}},\n`;
    } else {
      interfaceFields += `${interfaceIndent}${key}: ${mapType(type)};\n`;
      mongooseFields += `${mongooseIndent}${key}: { type: ${mapMongooseType(type)}, required: true },\n`;
    }
  }

  return { interfaceFields, mongooseFields };
}

function mapType(type) {
  switch (type) {
    case 'string': return 'string';
    case 'number': return 'number';
    case 'boolean': return 'boolean';
    case 'date': return 'Date';
    default: return 'string'; // Default to string for unknown types
  }
}

function mapMongooseType(type) {
  switch (type) {
    case 'string': return 'String';
    case 'number': return 'Number';
    case 'boolean': return 'Boolean';
    case 'date': return 'Date';
    default: return 'String'; // Default to String for unknown types
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const uri = 'mongodb://athena_ehi_chc_admin:htfo9rS$p!4cTnkT@localhost:27017';
const dbName = 'athena_ehi_chc';
const limit = 90000;

generateSchema(uri, dbName).catch(console.error);