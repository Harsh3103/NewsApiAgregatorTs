import axios from "axios";

// ✅ Define TypeScript interface for API response
interface TranslationResponse {
    responseData: {
        translatedText: string;
    };
}

// ✅ Utility function to translate text with default translation to Chinese (zh-CN)
export const translateText = async (text: string, lang: string = "zh-CN"): Promise<string> => {
    if (!text || lang === "en") return text; // Skip translation if English
    
    const translationURL = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${lang || "zh-CN"}`;
    
    try {
        console.log(`🌍 Making translation request to: ${translationURL}`); // ✅ Log the URL
        const response = await axios.get<TranslationResponse>(translationURL);
        
        console.log("🔄 Translation API Response:", response.data);
        return response.data.responseData.translatedText || text;
    } catch (error: any) {
        console.error("❌ Translation API Error:", error.message);
        return text; // Fallback to original text if translation fails
    }
};
