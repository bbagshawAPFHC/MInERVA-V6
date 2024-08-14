import { Request, Response } from 'express';
import mongoose from 'mongoose';

export const getAllPatientData = async (req: Request, res: Response) => {
  try {
    const patientId = req.params.id;
    const db = mongoose.connection.db;

    if (!db) {
      throw new Error('Database connection is not established');
    }

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
};

export const searchPatients = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    const { limit } = req.query; // Add this line to get the limit from the request query
    const db = mongoose.connection.db;

    if (!db) {
      throw new Error('Database connection is not established');
    }

    const collection = db.collection('demographic');

    const patients = await collection.find({
      $or: [
        { "patientdetails.firstname": new RegExp(query as string, 'i') },
        { "patientdetails.lastname": new RegExp(query as string, 'i') },
        { "patientdetails.athenapatientid": query }
      ]
    }).limit(Number(limit)).toArray(); // Use the limit variable to set the limit

    if (patients.length === 0) {
      return res.status(404).json({ message: 'No patients found' });
    }

    res.status(200).json(patients);
  } catch (error: any) {
    console.error('Error searching patients:', error);
    res.status(500).json({ message: error.message });
  }
};
