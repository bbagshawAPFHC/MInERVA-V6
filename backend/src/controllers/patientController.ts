// src/controllers/patientController.ts
import { Request, Response } from 'express';
import { Patient } from '../models/Patient';

export const getPatientData = async (req: Request, res: Response) => {
  try {
    const { athenapatientid } = req.params;
    const patientData = await Patient.findOne({ athenapatientid });

    if (!patientData) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(patientData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
