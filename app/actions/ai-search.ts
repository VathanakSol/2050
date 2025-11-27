'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function getAIAnswer(query: string) {
    if (!process.env.GEMINI_API_KEY) {
        return null;
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `You are a helpful developer assistant for a software developer. 
        Provide a concise, futuristic, and technically accurate answer to the following query: "${query}".
        Format the answer with Markdown. Keep it under 200 words. 
        Focus on modern/future tech stacks and best practices.
        
        IMPORTANT: At the end of your answer, provide a list of 3-5 relevant external resources (documentation, tutorials, or articles) as clickable links.
        Format the links as a markdown list like this:
        ### Resources
        - [Title](URL)
        - [Title](URL)`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error getting AI answer:', error);
        return null;
    }
}
