import express from 'express';
import { getAllPatientData } from '../controllers/demographicController';

const router = express.Router();

router.get('/demographic/:id', getAllPatientData);

export default router;