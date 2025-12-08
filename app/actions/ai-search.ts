'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface Course {
    id: number;
    title: string;
    description: string;
    level: string;
    duration: string;
    students: string;
    category: string;
    icon: string;
}

export async function getAIAnswer(query: string) {
    if (!process.env.GEMINI_API_KEY) {
        return null;
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

        const prompt = `You are an AI co-pilot designed to assist a senior software developer with general IT knowledge, concepts, and best practices. Your goal is to provide highly relevant, forward-thinking, and technically precise answers.

When responding to the query: "${query}", please adhere to the following guidelines:

**1. Tone & Persona:**
*   Adopt the voice of an experienced, pragmatic, and helpful lead developer or architect.
*   Assume the user has a solid foundational understanding of software development.
*   Be authoritative but approachable.

**2. Content & Focus:**
*   Provide a direct and concise answer first, then elaborate briefly with context or implications.
*   Focus on modern/future tech stacks, emerging standards, and industry best practices.
*   Prioritize actionable insights, practical implications, and real-world applicability.
*   If applicable, briefly touch upon key considerations, trade-offs, or different perspectives without excessive detail.
*   Avoid overly speculative or theoretical responses; ground your answers in current or near-future realities.
*   Ensure all technical details are accurate and up-to-date.

**3. Formatting & Length:**
*   Format your entire answer using Markdown for excellent readability (e.g., headings, bullet points, code blocks for very short inline examples if crucial).
*   Keep the core answer (excluding resources) between 150-200 words. Conciseness is paramount.

**4. Resources (Crucial):**
*   At the very end of your response, provide a list of 3 to 5 highly relevant external resources.
*   Prioritize official documentation, reputable open-source project sites, well-regarded industry articles, or foundational academic papers (if directly applicable).
*   Ensure links are active and directly related to the topic.
*   Format these as a markdown list under a level 3 heading \`### Resources\`:
    \`\`\`markdown
    ### Resources
    - [Resource Title 1](https://example.com/url1)
    - [Resource Title 2](https://example.com/url2)
    - [Resource Title 3](https://example.com/url3)
    \`\`\`

**5. Constraints:**
*   Do NOT engage in conversational pleasantries (e.g., "Certainly!", "Here's your answer:"). Get straight to the point.
*   Do NOT provide extensive code examples unless the query specifically asks for them AND they are brief and illustrative.
*   Do NOT offer personal opinions or preferences; stick to factual information and best practices.
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error getting AI answer:', error);
        return null;
    }
}

export async function getPopularCourses(): Promise<Course[]> {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `Generate 5 popular online learning courses for developers in 2025. 
        For each course, provide the following in valid JSON format:
        - title: Course name
        - description: Brief description (1-2 sentences, max 150 characters)
        - level: "Beginner", "Intermediate", or "Advanced"
        - duration: e.g., "8 weeks", "12 weeks"
        - students: Number of students enrolled (e.g., "45.2K", "38.5K")
        - category: Main category (e.g., "Web Development", "AI", "Mobile")
        - icon: Single emoji that represents the course

        Return ONLY a JSON array with 5 courses, no additional text or markdown.
        Example format:
        [
            {
                "title": "Course Name",
                "description": "Description here",
                "level": "Intermediate",
                "duration": "10 weeks",
                "students": "42.5K",
                "category": "Category Name",
                "icon": "💻"
            }
        ]`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // Clean the response to extract JSON
        let jsonText = text.trim();

        // Remove markdown code blocks if present
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/```json\s*/, '').replace(/```\s*$/, '');
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/```\s*/, '').replace(/```\s*$/, '');
        }

        const courses = JSON.parse(jsonText);

        // Add IDs to courses
        const coursesWithIds = courses.map((course: Omit<Course, 'id'>, index: number) => ({
            id: index + 1,
            ...course
        }));

        return coursesWithIds;
    } catch (error) {
        console.error('Error fetching courses from AI:', error);

        // Return fallback courses if AI fails
        return [
            {
                id: 1,
                title: "Full Stack Web Development",
                description: "Master modern web development with React, Node.js, and MongoDB. Build production-ready applications.",
                level: "Intermediate",
                duration: "12 weeks",
                students: "45.2K",
                category: "Web Development",
                icon: "💻"
            },
            {
                id: 2,
                title: "AI & Machine Learning",
                description: "Learn Python, TensorFlow, and neural networks. Create intelligent systems from scratch.",
                level: "Beginner",
                duration: "10 weeks",
                students: "38.5K",
                category: "Artificial Intelligence",
                icon: "🤖"
            },
            {
                id: 3,
                title: "Mobile App Development",
                description: "Build native iOS and Android apps with React Native. Deploy to app stores.",
                level: "Intermediate",
                duration: "8 weeks",
                students: "32.1K",
                category: "Mobile Development",
                icon: "📱"
            },
            {
                id: 4,
                title: "Cloud Architecture",
                description: "Master AWS, Docker, and Kubernetes. Design scalable cloud-native applications.",
                level: "Advanced",
                duration: "14 weeks",
                students: "28.9K",
                category: "Cloud Computing",
                icon: "☁️"
            },
            {
                id: 5,
                title: "Data Science",
                description: "Learn Python, Pandas, and data visualization. Make data-driven decisions.",
                level: "Beginner",
                duration: "10 weeks",
                students: "41.3K",
                category: "Data Science",
                icon: "📊"
            }
        ];
    }
}