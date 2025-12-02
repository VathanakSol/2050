/**
 * Parse AI responses to extract original and fixed code blocks
 */

export interface ParsedCodeResponse {
    originalCode?: string;
    fixedCode?: string;
    language?: string;
    explanation?: string;
    hasCodeBlocks: boolean;
}

/**
 * Extract code blocks from markdown with language and content
 */
function extractCodeBlocks(markdown: string): Array<{ lang: string; code: string }> {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const blocks: Array<{ lang: string; code: string }> = [];

    let match;
    while ((match = codeBlockRegex.exec(markdown)) !== null) {
        blocks.push({
            lang: match[1] || '',
            code: match[2].trim()
        });
    }

    return blocks;
}

/**
 * Parse Code Fixer response to extract original and fixed code
 */
export function parseCodeFixerResponse(response: string): ParsedCodeResponse {
    const codeBlocks = extractCodeBlocks(response);

    if (codeBlocks.length === 0) {
        return {
            hasCodeBlocks: false,
            explanation: response
        };
    }

    // Strategy 1: Look for "original" and "fixed" markers in text
    const originalMatch = response.match(/(?:original|before|broken|buggy)\s+code[:\s]*```/i);
    const fixedMatch = response.match(/(?:fixed|corrected|after|solution)\s+code[:\s]*```/i);

    let originalCode: string | undefined;
    let fixedCode: string | undefined;
    let language: string | undefined;

    if (originalMatch && fixedMatch) {
        // Found explicit markers - assign accordingly
        const blocks = extractCodeBlocks(response);
        if (blocks.length >= 2) {
            originalCode = blocks[0].code;
            fixedCode = blocks[1].code;
            language = blocks[1].lang || blocks[0].lang;
        }
    } else if (codeBlocks.length === 2) {
        // Two code blocks - assume first is original, second is fixed
        originalCode = codeBlocks[0].code;
        fixedCode = codeBlocks[1].code;
        language = codeBlocks[1].lang || codeBlocks[0].lang;
    } else if (codeBlocks.length === 1) {
        // Only one code block - likely the fixed version
        fixedCode = codeBlocks[0].code;
        language = codeBlocks[0].lang;
    } else if (codeBlocks.length > 2) {
        // Multiple blocks - try to find the corrected one
        // Usually the longest or the one after "corrected" keyword
        const correctedIndex = response.toLowerCase().indexOf('corrected');
        if (correctedIndex !== -1) {
            // Find the code block closest after "corrected"
            const afterCorrected = response.substring(correctedIndex);
            const blocksAfter = extractCodeBlocks(afterCorrected);
            if (blocksAfter.length > 0) {
                fixedCode = blocksAfter[0].code;
                language = blocksAfter[0].lang;
            }
        } else {
            // Default to the longest code block
            const longest = codeBlocks.reduce((prev, current) =>
                current.code.length > prev.code.length ? current : prev
            );
            fixedCode = longest.code;
            language = longest.lang;
        }
    }

    // Extract explanation (text before first code block or between blocks)
    const firstCodeBlockIndex = response.indexOf('```');
    const explanation = firstCodeBlockIndex > 0
        ? response.substring(0, firstCodeBlockIndex).trim()
        : response;

    return {
        originalCode,
        fixedCode,
        language,
        explanation,
        hasCodeBlocks: codeBlocks.length > 0
    };
}

/**
 * Clean code by removing common artifacts
 */
export function cleanCode(code: string): string {
    return code
        .trim()
        .replace(/^\s*\/\/\s*fixed\s+code\s*/i, '') // Remove "// fixed code" comments
        .replace(/^\s*#\s*fixed\s+code\s*/i, '')   // Remove "# fixed code" comments
        .trim();
}

/**
 * Check if response contains a diff
 */
export function containsDiff(response: string): boolean {
    return /^[+-]\s/m.test(response) || response.includes('diff --git');
}

/**
 * Extract language from markdown code fence
 */
export function extractLanguageFromFence(fence: string): string | null {
    const match = fence.match(/^```(\w+)/);
    return match ? match[1] : null;
}

/**
 * Parse AI response based on model type
 */
export function parseAIResponse(response: string, modelType: 'general' | 'code-fixer') {
    if (modelType === 'code-fixer') {
        return parseCodeFixerResponse(response);
    }
    return null;
}
