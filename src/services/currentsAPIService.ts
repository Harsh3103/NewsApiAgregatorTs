import axios from 'axios';
import dotenv from 'dotenv';
// Define TypeScript interface for a news article with the required response format
interface NewsArticle {
    title: string;
    description?: string;
    content?: string;
    author?: string;
    source: string;
    url?: string;
    imageUrl?: string;
    publishedAt?: Date;
}

// Define API response type
interface CurrentsAPIResponse {
    status: string;
    news: {
        id: string;
        title: string;
        description?: string;
        url: string;
        author?: string;
        image?: string;
        category?: string[];
        published?: string;
        apisource: string;
    }[];
}

// Fetch news from CurrentsAPI
export const fetchNewsFromCurrentsAPI = async (query: string = ''): Promise<NewsArticle[]> => {
    const apiKey = 'q7NZFTHG6B6RrPNuIgehM27DF-vK6SGnFCeN1z6NqkR5NBf_';

    // ✅ Correctly format multiple keywords for CurrentsAPI
    const formattedQuery = query.split(' ').join('&');
    const url = formattedQuery
        ? `https://api.currentsapi.services/v1/search?keywords=${formattedQuery}&apiKey=${apiKey}`
        : `https://api.currentsapi.services/v1/latest-news?apiKey=${apiKey}`;

    console.log(`[CurrentsAPI] Fetching from: ${url}`); // ✅ Log the URL

    try {
        // ✅ Explicitly define response type using generics
        const response = await axios.get<CurrentsAPIResponse>(url);

        return response.data.news.map((article) => ({
            title: article.title,
            description: article.description,
            content: article.description, // Mapping description as content since API doesn't provide it separately
            author: article.author,
            source: 'CurrentsAPI', // Fixed value as the source
            url: article.url,
            imageUrl: article.image, // Renaming 'image' to 'imageUrl'
            publishedAt: article.published ? new Date(article.published) : undefined, // Convert to Date
        }));
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`❌ Error fetching from CurrentsAPI (URL: ${url}):`, error.message);
        } else {
            console.error(`❌ Unknown error in CurrentsAPI:`, error);
        }
        return [];
    }
};
