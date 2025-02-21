import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include user property
interface RequestWithUser extends Request {
    user?: {
        id: string;
        role: string;
    };
}

export const authMiddleware = (req: RequestWithUser, res: Response, next: NextFunction): Response | void => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Invalid token format' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; role: string };
        req.user = { id: decoded.userId, role: decoded.role };
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export default authMiddleware;
