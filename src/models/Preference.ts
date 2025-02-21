import mongoose from 'mongoose';
import languageCodes from '../utils/languageCodes';

// Define the Preference Schema
const preferenceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    categories: { type: [String], default: [] }, // Example: ["Technology", "Sports"]
    language: { 
        type: String, 
        default: languageCodes.english, // ✅ Defaults to english
        enum: Object.values(languageCodes) // ✅ Ensures only valid language codes are stored
    },
    notifications: { type: Boolean, default: true }, // Example: User wants notifications
    darkMode: { type: Boolean, default: false } // UI Preference
}, { timestamps: true });

export default mongoose.model('Preference', preferenceSchema);
