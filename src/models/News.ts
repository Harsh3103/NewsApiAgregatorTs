import mongoose, { Document, Schema } from 'mongoose';

// Define the TypeScript interface for News document
interface INews extends Document {
    title: string;
    description?: string;
    content?: string;
    author?: string;
    source: 'NewsAPI' | 'CurrentsAPI' | 'The Guardian' | 'MyNews';
    url?: string;
    imageUrl?: string;
    publishedAt?: Date;
}

// Define the schema with TypeScript types
const newsSchema = new Schema<INews>(
    {
        title: { type: String, required: true },
        description: { type: String },
        content: { type: String },
        author: { type: String },
        source: { 
            type: String, 
            enum: ['NewsAPI', 'CurrentsAPI', 'The Guardian', 'MyNews'], 
            required: true 
        },
        url: { type: String },
        imageUrl: { type: String },
        publishedAt: { type: Date, default: Date.now }
    }, 
    { timestamps: true }
);

// Create and export the model
const News = mongoose.model<INews>('News', newsSchema);
export default News;
