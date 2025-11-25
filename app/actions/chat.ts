'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface ChatMessage {
    role: 'user' | 'model';
    parts: string;
}

export async function sendMessage(history: ChatMessage[], message: string) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('GEMINI_API_KEY is not set in environment variables');
            throw new Error('API key not configured');
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const chat = model.startChat({
            history: history.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.parts }],
            })),
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        return text;
    } catch (error) {
        console.error('Error sending message to Gemini:', error);
        // Return a user-friendly error message instead of throwing
        return `Error: ${error instanceof Error ? error.message : 'Failed to connect to AI'}`;
    }
}
