import { Request, Response, NextFunction } from 'express';

// Extend Express Request type to include user property
interface RequestWithUser extends Request {
    user?: {
        id: string;
        role: string;
    };
}

const roleMiddleware = (roles: string[]) => {
    return (req: RequestWithUser, res: Response, next: NextFunction): Response | void => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};

export default roleMiddleware;
