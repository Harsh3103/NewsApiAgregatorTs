import { Request, Response } from 'express';
import Preference from '../models/Preference';

// Save User Preferences
export const savePreferences = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id; // Extract userId from token
        const { categories, language, notifications, darkMode } = req.body;

        let preference = await Preference.findOne({ userId });

        if (preference) {
            return res.status(400).json({ message: "Preferences already exist for this user." });
        }

        preference = new Preference({ userId, categories, language, notifications, darkMode });
        await preference.save();

        res.status(201).json({ message: "Preferences saved successfully.", preference });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get User Preferences
export const getPreferences = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id; // Extract userId from token
        const preference = await Preference.findOne({ userId });

        if (!preference) {
            return res.status(404).json({ message: "Preferences not found for this user." });
        }

        res.json(preference);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Update User Preferences
export const updatePreferences = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id; // Extract userId from token
        const updates = req.body;

        const preference = await Preference.findOneAndUpdate({ userId }, updates, { new: true });

        if (!preference) {
            return res.status(404).json({ message: "Preferences not found." });
        }

        res.json({ message: "Preferences updated successfully.", preference });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Delete User Preferences
export const deletePreferences = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id; // Extract userId from token
        const preference = await Preference.findOneAndDelete({ userId });

        if (!preference) {
            return res.status(404).json({ message: "Preferences not found." });
        }

        res.json({ message: "Preferences deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
