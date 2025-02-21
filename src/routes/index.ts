import express from 'express';
import autRoutes from './authRoutes'
import newsRoutes from './newsRoutes';
import preferenceRoutes from './preferenceRoutes';
import userRoutes from './userRoutes';
import authMiddleware from '../middlewares/authMiddleware';
import roleMiddleware from '../middlewares/roleMiddleware';
const router = express.Router();

router.use('/auth', autRoutes);
router.use('/news', authMiddleware ,roleMiddleware(['admin','editor','user']), newsRoutes);
router.use('/preferences', authMiddleware ,roleMiddleware(['user']), preferenceRoutes);
router.use('/user', authMiddleware ,roleMiddleware(['admin','user']), userRoutes);

export default router;
