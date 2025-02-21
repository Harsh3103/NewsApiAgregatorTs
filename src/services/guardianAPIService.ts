import axios from 'axios';

// Define TypeScript interface for a news article
interface NewsArticle {
    id: string;
    webTitle: string;
    webUrl: string;
    sectionName?: string;
    pillarName?: string;
    apisource: string; // Custom field to indicate source
}

// Define API response type
interface GuardianAPIResponse {
    response: {
        status: string;
        results: NewsArticle[];
    };
}

// Fetch news from The Guardian API
export const fetchNewsFromGuardianAPI = async (query: string = ''): Promise<NewsArticle[]> => {
    const apiKey = '068ad7c1-8a40-4ad7-8c35-cbdfb4567055';
    const url = query 
        ? `https://content.guardianapis.com/search?q=${query}&api-key=${apiKey}`
        : `https://content.guardianapis.com/search?api-key=${apiKey}`;
        console.log(`[GuardianAPI] Fetching from: ${url}`); // ✅ Log the URL
    try {
        // ✅ Ensure TypeScript correctly infers the response type
        const response = await axios.get<GuardianAPIResponse>(url);

        return response.data.response.results.map((article) => ({
            id: article.id,
            webTitle: article.webTitle,
            webUrl: article.webUrl,
            sectionName: article.sectionName,
            pillarName: article.pillarName,
            apisource: 'The Guardian' // Add source field
        }));
    } catch (error) {
        console.error('Error fetching from GuardianAPI:', error);
        return [];
    }
};
