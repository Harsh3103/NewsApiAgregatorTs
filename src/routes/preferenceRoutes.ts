import express from 'express';
import { savePreferences, getPreferences, updatePreferences, deletePreferences } from '../controllers/preferenceController';

const router = express.Router();

router.post('/addprf',  savePreferences); // Save preferences
router.get('/getprf', getPreferences); // Get preferences
router.put('/updateprf', updatePreferences); // Update preferences
router.delete('/deleteprf', deletePreferences); // Delete preferences

export default router;
