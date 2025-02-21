import { Request, Response, NextFunction } from "express";
import User from "../models/User";

// ✅ Middleware to extract user from token
interface AuthenticatedRequest extends Request {
    user?: { userId: string; role: string };
}

// ✅ Get User Details
export const getUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.userId;
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (err) {
        next(err);
    }
};

// ✅ Update User
export const updateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id; 
        const { name, email } = req.body;
        console.log("Extracted User ID from Token:", userId);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, email },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(updatedUser);
    } catch (err) {
        next(err);
    }
};

// ✅ Delete User
export const deleteUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id; 
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        next(err);
    }
};
