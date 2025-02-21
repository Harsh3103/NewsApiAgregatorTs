import express, { Request, Response } from 'express';
import { registerUser, loginUser,logoutUser } from '../controllers/authController';
import authMiddleware from '../middlewares/authMiddleware';
import roleMiddleware from '../middlewares/roleMiddleware';

const router = express.Router();

// User Registration
router.post('/register', registerUser);

// User Login
router.post('/login', loginUser);
router.post("/logout", logoutUser);
// Protected Route Example (Only Admins can access)
router.get('/admin-only', authMiddleware, roleMiddleware(['admin']), (req: Request, res: Response) => {
    res.json({ message: 'Welcome Admin!' });
});

export default router;
