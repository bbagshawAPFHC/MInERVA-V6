import express from 'express';
import { downloadFile } from '../controllers/fileController';

const router = express.Router();

router.get('/file-download', downloadFile);

export default router;