'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateRequestBody(prompt: string) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
        const result = await model.generateContent(`Generate a valid JSON request body for the following description: "${prompt}". Return ONLY the JSON string, no markdown formatting.`);
        const response = await result.response;
        let text = response.text();
        // Clean up potential markdown code blocks
        text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        try {
            const json = JSON.parse(text);
            return JSON.stringify(json, null, 2);
        } catch (e) {
            return text;
        }
    } catch (error) {
        console.error('Error generating request body:', error);
        throw new Error('Failed to generate request body');
    }
}
