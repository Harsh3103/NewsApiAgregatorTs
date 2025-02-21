import express, { Request, Response } from 'express';

import { fetchAllNews, fetchNewsBySource, addNews, updateNews, deleteNews , fetchNewsByUserPreferences} from '../controllers/newsController';


const router = express.Router();

// Fetch all news (Protected route)
router.get('/all', fetchAllNews);

// Fetch news by source (Only logged-in users)
router.get('/source', fetchNewsBySource);
router.get('/NewsByUserPreferences', fetchNewsByUserPreferences);

// Routes for adding, updating, and deleting news (Admin only)
router.post('/add', addNews);
router.put('/update/:id', updateNews);
router.delete('/delete/:id', deleteNews);

export default router;
