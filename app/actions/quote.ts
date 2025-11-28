'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function getMotivationalQuote(): Promise<string> {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `Generate a short, inspiring motivational quote for developers and tech enthusiasts. 
        The quote should be original, concise (max 15 words), and related to technology, coding, innovation, or personal growth.
        Return ONLY the quote text without quotation marks or attribution.`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const quote = response.text().trim();

        return quote;
    } catch (error) {
        console.error('Error generating quote:', error);
        return 'Build something amazing today.';
    }
}
