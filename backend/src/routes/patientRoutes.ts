import express from 'express';
import { getPatientFiles } from '../controllers/fileController';
import { bulkDownload } from '../controllers/bulkDownloadController';

const router = express.Router();

router.get('/patient-files/:athenapatientid', getPatientFiles);
router.post('/bulk-download', bulkDownload);

export default router;