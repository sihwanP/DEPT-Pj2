import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

interface TranslateRequest {
    text: string | string[];
    targetLang: string;
}

export const translateText = async ({ text, targetLang }: TranslateRequest): Promise<string | string[]> => {
    if (!apiKey) {
        console.error('GEMINI_API_KEY is not set');
        throw new Error('Translation service is not configured.');
    }

    try {
        const isArray = Array.isArray(text);
        const textToTranslate = isArray ? (text as string[]).join('\n---\n') : (text as string);

        const prompt = `
        Translate the following text to ${targetLang}.
        Maintain the original tone and context.
        Return only the translated text.
        If the input contains multiple segments separated by "---", keep them separated by "---" in the output.
        
        Text to translate:
        ${textToTranslate}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const translated = response.text().trim();

        if (isArray) {
            return translated.split('\n---\n').map((s: string) => s.trim());
        }

        return translated;
    } catch (error) {
        console.error('Translation error:', error);
        throw new Error('Failed to translate text.');
    }
};
