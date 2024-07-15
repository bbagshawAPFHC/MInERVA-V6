import express from 'express';
import { getAllPatientData, searchPatients } from '../controllers/readOnlyController';

const router = express.Router();

router.get('/demographic/:id', getAllPatientData);
router.get('/patients/search', searchPatients);

export default router;