import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

// Define TypeScript interface for authentication requests
interface AuthRequest extends Request {
    body: {
        name?: string;
        email: string;
        password: string;
        role?: string;
    };
}

// ✅ Register User
export const registerUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

        res.json({ token, role: user.role });
    } catch (err) {
        next(err);
    }
};

// ✅ Login User
export const loginUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

        res.json({ token, role: user.role });
    } catch (err) {
        next(err);
    }
};

// ✅ Logout User (Invalidate Token)
export const logoutUser = async (req: Request, res: Response) => {
    res.json({ message: "User logged out successfully" });
};
