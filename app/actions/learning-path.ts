'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// TypeScript Interfaces
export interface UserProfile {
    skillLevel: 'beginner' | 'junior' | 'intermediate' | 'senior' | 'expert';
    targetRole: string;
    hoursPerWeek: number;
    currentSkills: string[];
    learningStyle: 'project-based' | 'tutorial-based' | 'documentation-based' | 'mixed';
}

export interface Resource {
    title: string;
    url: string;
    type: 'tutorial' | 'course' | 'docs' | 'project' | 'article' | 'video';
    duration: string;
    isFree: boolean;
}

export interface Milestone {
    id: number;
    title: string;
    description: string;
    duration: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    skills: string[];
    resources: Resource[];
    tasks: string[];
    prerequisites: number[];
}

export interface LearningPath {
    title: string;
    description: string;
    estimatedDuration: string;
    milestones: Milestone[];
    generatedAt: string;
}

/**
 * Generate a personalized learning roadmap using AI
 */
export async function generateLearningPath(profile: UserProfile): Promise<LearningPath | { error: string }> {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('GEMINI_API_KEY is not set in environment variables');
            return { error: 'API key not configured' };
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `You are a senior software engineering mentor creating a personalized learning roadmap.

USER PROFILE:
- Current Level: ${profile.skillLevel}
- Target Role: ${profile.targetRole}
- Time Commitment: ${profile.hoursPerWeek} hours/week
- Current Skills: ${profile.currentSkills.join(', ') || 'None'}
- Learning Style: ${profile.learningStyle}

Generate a detailed, milestone-based learning path in JSON format. Return ONLY valid JSON without any markdown formatting or code blocks.

{
  "title": "Learning Path Title (e.g., 'Frontend Developer Roadmap')",
  "description": "Brief overview of what this learning path covers",
  "estimatedDuration": "X months (realistic based on hours/week)",
  "milestones": [
    {
      "id": 1,
      "title": "Milestone Title",
      "description": "What you'll learn in this phase",
      "duration": "2 weeks",
      "difficulty": "beginner",
      "skills": ["skill1", "skill2"],
      "resources": [
        {
          "title": "Resource Title",
          "url": "https://real-url.com",
          "type": "tutorial",
          "duration": "5 hours",
          "isFree": true
        }
      ],
      "tasks": ["Complete task 1", "Build project 2"],
      "prerequisites": []
    }
  ]
}

REQUIREMENTS:
- Create 8-12 progressive milestones
- Include mix of theory and hands-on projects
- Provide REAL, high-quality, free/affordable resources with actual URLs
- Ensure realistic timelines based on ${profile.hoursPerWeek} hours/week commitment
- Build skills incrementally with clear dependencies
- Include portfolio-building projects
- For beginners, start with fundamentals
- For advanced users, focus on specialized topics
- Tailor to ${profile.learningStyle} learning style
- Return ONLY the JSON object, no markdown formatting`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean up response - remove markdown code blocks if present
        text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        // Parse the JSON response
        const learningPath: LearningPath = JSON.parse(text);

        // Add generation timestamp
        learningPath.generatedAt = new Date().toISOString();

        return learningPath;
    } catch (error) {
        console.error('Error generating learning path:', error);

        if (error instanceof SyntaxError) {
            return { error: 'Failed to parse AI response. Please try again.' };
        }

        return {
            error: error instanceof Error
                ? error.message
                : 'Failed to generate learning path. Please try again.'
        };
    }
}

/**
 * Get sample learning paths for inspiration
 */
export async function getSamplePaths(): Promise<LearningPath[]> {
    return [
        {
            title: 'Frontend Developer Roadmap',
            description: 'Complete path from beginner to job-ready frontend developer',
            estimatedDuration: '6 months',
            generatedAt: new Date().toISOString(),
            milestones: [
                {
                    id: 1,
                    title: 'HTML & CSS Fundamentals',
                    description: 'Master the building blocks of web development',
                    duration: '3 weeks',
                    difficulty: 'beginner',
                    skills: ['HTML5', 'CSS3', 'Responsive Design'],
                    resources: [
                        {
                            title: 'MDN Web Docs - HTML',
                            url: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
                            type: 'docs',
                            duration: '10 hours',
                            isFree: true
                        },
                        {
                            title: 'CSS Tricks - Flexbox Guide',
                            url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/',
                            type: 'tutorial',
                            duration: '2 hours',
                            isFree: true
                        }
                    ],
                    tasks: [
                        'Build a personal portfolio website',
                        'Create responsive layouts using Flexbox and Grid',
                        'Complete 10 CSS challenges on Frontend Mentor'
                    ],
                    prerequisites: []
                }
            ]
        }
    ];
}
