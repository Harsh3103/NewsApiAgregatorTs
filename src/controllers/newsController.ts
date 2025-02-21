import { Request, Response, NextFunction } from 'express';
import { fetchNewsFromNewsAPI } from '../services/newsAPIService';
import { fetchNewsFromCurrentsAPI } from '../services/currentsAPIService';
import { fetchNewsFromGuardianAPI } from '../services/guardianAPIService';
import Preference from '../models/Preference';
import News from '../models/News'; // Assuming a Mongoose model is defined
import axios from "axios";
import { translateText } from "../services/translationService";
// ✅ Define a TypeScript interface for translation API response
interface TranslationResponse {
    responseData: {
        translatedText: string;
    };
}


// Fetch all news
export const fetchAllNews = async (req: Request, res: Response, next: NextFunction) => {
    const { query } = req.query as { query?: string };
    try {
        // Fetch news concurrently using Promise.all
        const [newsFromNewsAPI, newsFromCurrentsAPI, newsFromGuardianAPI, storedNews] = await Promise.all([
            fetchNewsFromNewsAPI(query || ''),
            fetchNewsFromCurrentsAPI(query || ''),
            fetchNewsFromGuardianAPI(query || ''),
            News.find(query ? { title: new RegExp(query, 'i') } : {})
        ]);

        res.json({
            status: 'success',
            data: [...newsFromNewsAPI, ...newsFromCurrentsAPI, ...newsFromGuardianAPI, ...storedNews],
        });
    } catch (error) {
        next(error);
    }
};

// Fetch news by source
export const fetchNewsBySource = async (req: Request, res: Response, next: NextFunction) => {
    const { source, query } = req.query as { source?: string; query?: string };
    try {
        let news = [];

        switch (source) {
            case 'NewsAPI':
                news = await fetchNewsFromNewsAPI(query || '');
                break;
            case 'CurrentsAPI':
                news = await fetchNewsFromCurrentsAPI(query || '');
                break;
            case 'GuardianAPI':
                news = await fetchNewsFromGuardianAPI(query || '');
                break;
            case 'MyNewsAPI':
                news = await News.find(query ? { title: new RegExp(query, 'i') } : {});
                break;
            default:
                return res.status(400).json({ status: 'error', message: 'Invalid source' });
        }

        res.json({
            status: 'success',
            data: news,
        });
    } catch (error) {
        next(error);
    }
};

// Add news
export const addNews = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newsData = new News(req.body);
        const savedNews = await newsData.save();
        res.status(201).json({ status: 'success', data: savedNews });
    } catch (error) {
        next(error);
    }
};

// Update news
export const updateNews = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const updatedNews = await News.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedNews) {
            return res.status(404).json({ status: 'error', message: 'News not found' });
        }
        res.json({ status: 'success', data: updatedNews });
    } catch (error) {
        next(error);
    }
};

// Delete news
export const deleteNews = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const deletedNews = await News.findByIdAndDelete(id);
        if (!deletedNews) {
            return res.status(404).json({ status: 'error', message: 'News not found' });
        }
        res.json({ status: 'success', message: 'News deleted successfully' });
    } catch (error) {
        next(error);
    }
};



// ✅ Standardize and translate API responses
const formatNews = async (newsArray: any[], apiSource: string, preferredLanguage: string) => {
    return Promise.all(
        newsArray.map(async (article) => ({
            id: article.id || article.webUrl || article.url || `news_${Math.random().toString(36).substr(2, 9)}`,
            title: await translateText(article.title || article.webTitle || "Untitled News", preferredLanguage),
            description: await translateText(article.description || "No description available.", preferredLanguage),
            url: article.url || article.webUrl || "https://example.com/no-url",
            author: await translateText(article.author || article.source?.name || apiSource, preferredLanguage), // ✅ Uses source name if author is missing
            image: article.urlToImage || article.image || "https://via.placeholder.com/150",
            publishedAt: article.publishedAt || new Date().toISOString(),
            source: {
                name: article.source?.name || apiSource,
                api: apiSource,
            },
        }))
    );
};

// ✅ Fetch news based on user preferences

// ✅ Fetch news based on user preferences
export const fetchNewsByUserPreferences = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;
        const userPreferences = await Preference.findOne({ userId });

        if (!userPreferences) {
            return res.status(404).json({ status: "error", message: "User preferences not found." });
        }

        const { categories, language } = userPreferences;
        const preferredLanguage = language || "zh-CN"; // ✅ Default to Chinese if no language is set
        const searchQuery = categories.length > 0 ? categories.join(" ") : "latest";

        console.log(`📢 Fetching news based on user preferences: ${searchQuery}`);
        console.log(`🌍 User preferred language: ${preferredLanguage}`);

        const results = await Promise.allSettled([
            fetchNewsFromNewsAPI(searchQuery),
            fetchNewsFromCurrentsAPI(searchQuery),
            fetchNewsFromGuardianAPI(searchQuery),
            News.find({ category: { $in: categories } }).sort({ publishedAt: -1 }).limit(10).lean(),
        ]);

        const formatNews = async (newsArray: any[], apiSource: string) => {
            return Promise.all(
                newsArray.map(async (article) => ({
                    id: article.id || article.url || `news_${Math.random().toString(36).substr(2, 9)}`,
                    title: await translateText(article.title || "Untitled News", preferredLanguage),
                    description: await translateText(article.description || "No description available.", preferredLanguage),
                    url: article.url || "https://example.com/no-url",
                    author: await translateText(article.author || article.source?.name || apiSource, preferredLanguage),
                    image: article.urlToImage || article.image || "https://via.placeholder.com/150",
                    publishedAt: article.publishedAt || new Date().toISOString(),
                    source: {
                        name: article.source?.name || apiSource,
                        api: apiSource,
                    },
                }))
            );
        };

        const newsFromNewsAPI = results[0].status === "fulfilled" ? await formatNews(results[0].value.slice(0, 10), "NewsAPI") : [];
        const newsFromCurrentsAPI = results[1].status === "fulfilled" ? await formatNews(results[1].value.slice(0, 10), "CurrentsAPI") : [];
        const newsFromGuardianAPI = results[2].status === "fulfilled" ? await formatNews(results[2].value.slice(0, 10), "GuardianAPI") : [];
        const storedNews = results[3].status === "fulfilled" ? await formatNews(results[3].value.slice(0, 10), "StoredNews") : [];

        console.log(`✅ NewsAPI Results: ${newsFromNewsAPI.length}`);
        console.log(`✅ CurrentsAPI Results: ${newsFromCurrentsAPI.length}`);
        console.log(`✅ GuardianAPI Results: ${newsFromGuardianAPI.length}`);
        console.log(`✅ Stored News Results: ${storedNews.length}`);

        if (!newsFromNewsAPI.length && !newsFromCurrentsAPI.length && !newsFromGuardianAPI.length && !storedNews.length) {
            return res.status(404).json({ status: "error", message: "No news found from any source." });
        }

        res.json({
            status: "success",
            sources: {
                newsAPI: newsFromNewsAPI.length > 0,
                currentsAPI: newsFromCurrentsAPI.length > 0,
                guardianAPI: newsFromGuardianAPI.length > 0,
                storedNews: storedNews.length > 0,
            },
            data: [...newsFromNewsAPI, ...newsFromCurrentsAPI, ...newsFromGuardianAPI, ...storedNews],
        });
    } catch (error) {
        next(error);
    }
};