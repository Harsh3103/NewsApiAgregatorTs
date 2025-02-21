import mongoose, { Document, Schema } from 'mongoose';

// Define TypeScript interface for User document
interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'editor' | 'user';
    createdAt?: Date;
}

// Define the schema with TypeScript types
const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['admin', 'editor', 'user'], default: 'user' },
        createdAt: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

// Create and export the model
const User = mongoose.model<IUser>('User', userSchema);
export default User;
