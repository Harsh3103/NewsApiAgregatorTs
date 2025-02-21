import axios from 'axios';

// Define TypeScript interface for a news article
interface NewsArticle {
    source: { id: string | null; name: string };
    author?: string;
    title: string;
    description?: string;
    url: string;
    urlToImage?: string;
    publishedAt: string;
    content?: string;
    apisource: string; // Custom field to indicate source
}

// Define API response type
interface NewsAPIResponse {
    status: string;
    totalResults: number;
    articles: NewsArticle[];
}

// Fetch news from NewsAPI.org
export const fetchNewsFromNewsAPI = async (query: string = ''): Promise<NewsArticle[]> => {
    const apiKey = '1929dc5c2f334662af1a38070c9a2357';
    const url = query 
        ? `https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}`
        : `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;
        console.log(`[NewsAPI] Fetching from: ${url}`); // ✅ Log the URL
    try {
        // ✅ No need to import AxiosResponse, TypeScript infers the response type
        const response = await axios.get<NewsAPIResponse>(url);

        return response.data.articles.map((article) => ({
            ...article,
            apisource: 'NewsAPI' // Add source field
        }));
    } catch (error) {
        console.error('Error fetching from NewsAPI:', error);
        return [];
    }
};
