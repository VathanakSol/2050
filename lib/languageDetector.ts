/**
 * Language detection utility for code files
 * Detects programming language from file extension or code patterns
 */

export interface LanguageInfo {
    id: string;           // Language ID for syntax highlighter
    name: string;         // Display name
    extension: string;    // File extension
    icon: string;         // Emoji icon
}

const LANGUAGE_MAP: Record<string, LanguageInfo> = {
    // JavaScript/TypeScript
    'js': { id: 'javascript', name: 'JavaScript', extension: 'js', icon: '🟨' },
    'jsx': { id: 'jsx', name: 'React JSX', extension: 'jsx', icon: '⚛️' },
    'ts': { id: 'typescript', name: 'TypeScript', extension: 'ts', icon: '🔷' },
    'tsx': { id: 'tsx', name: 'React TSX', extension: 'tsx', icon: '⚛️' },
    'mjs': { id: 'javascript', name: 'JavaScript Module', extension: 'mjs', icon: '🟨' },

    // Python
    'py': { id: 'python', name: 'Python', extension: 'py', icon: '🐍' },

    // Web
    'html': { id: 'html', name: 'HTML', extension: 'html', icon: '🌐' },
    'css': { id: 'css', name: 'CSS', extension: 'css', icon: '🎨' },
    'scss': { id: 'scss', name: 'SCSS', extension: 'scss', icon: '🎨' },
    'sass': { id: 'sass', name: 'Sass', extension: 'sass', icon: '🎨' },

    // Java/Kotlin
    'java': { id: 'java', name: 'Java', extension: 'java', icon: '☕' },
    'kt': { id: 'kotlin', name: 'Kotlin', extension: 'kt', icon: '🅺' },

    // C/C++
    'c': { id: 'c', name: 'C', extension: 'c', icon: '©️' },
    'cpp': { id: 'cpp', name: 'C++', extension: 'cpp', icon: '©️' },
    'cc': { id: 'cpp', name: 'C++', extension: 'cc', icon: '©️' },
    'h': { id: 'c', name: 'C Header', extension: 'h', icon: '©️' },
    'hpp': { id: 'cpp', name: 'C++ Header', extension: 'hpp', icon: '©️' },

    // C#
    'cs': { id: 'csharp', name: 'C#', extension: 'cs', icon: '🔷' },

    // Go
    'go': { id: 'go', name: 'Go', extension: 'go', icon: '🐹' },

    // Rust
    'rs': { id: 'rust', name: 'Rust', extension: 'rs', icon: '🦀' },

    // PHP
    'php': { id: 'php', name: 'PHP', extension: 'php', icon: '🐘' },

    // Ruby
    'rb': { id: 'ruby', name: 'Ruby', extension: 'rb', icon: '💎' },

    // Swift
    'swift': { id: 'swift', name: 'Swift', extension: 'swift', icon: '🍎' },

    // Shell
    'sh': { id: 'bash', name: 'Shell Script', extension: 'sh', icon: '🐚' },
    'bash': { id: 'bash', name: 'Bash', extension: 'bash', icon: '🐚' },
    'zsh': { id: 'bash', name: 'Zsh', extension: 'zsh', icon: '🐚' },

    // Data formats
    'json': { id: 'json', name: 'JSON', extension: 'json', icon: '📋' },
    'xml': { id: 'xml', name: 'XML', extension: 'xml', icon: '📄' },
    'yaml': { id: 'yaml', name: 'YAML', extension: 'yaml', icon: '📝' },
    'yml': { id: 'yaml', name: 'YAML', extension: 'yml', icon: '📝' },
    'toml': { id: 'toml', name: 'TOML', extension: 'toml', icon: '📝' },

    // Other
    'sql': { id: 'sql', name: 'SQL', extension: 'sql', icon: '🗄️' },
    'graphql': { id: 'graphql', name: 'GraphQL', extension: 'graphql', icon: '📊' },
    'md': { id: 'markdown', name: 'Markdown', extension: 'md', icon: '📝' },
};

const CODE_PATTERNS: Record<string, RegExp[]> = {
    'python': [/^import\s+\w+/, /^from\s+\w+\s+import/, /^def\s+\w+\s*\(/, /^class\s+\w+/],
    'javascript': [/^const\s+\w+/, /^let\s+\w+/, /^var\s+\w+/, /^function\s+\w+/, /^export\s+(default|const|function)/],
    'typescript': [/^interface\s+\w+/, /^type\s+\w+/, /:\s*(string|number|boolean|any)/, /^enum\s+\w+/],
    'java': [/^public\s+class/, /^private\s+(static\s+)?(\w+\s+)?\w+/, /^import\s+java\./],
    'cpp': [/^#include\s*</, /^using\s+namespace/, /^template\s*</],
    'go': [/^package\s+\w+/, /^import\s+\(/, /^func\s+\w+/],
    'rust': [/^fn\s+\w+/, /^let\s+mut\s+/, /^impl\s+\w+/, /^struct\s+\w+/],
    'php': [/^<\?php/, /^\$\w+\s*=/, /^function\s+\w+/],
    'ruby': [/^def\s+\w+/, /^class\s+\w+/, /^require\s+'/],
};

/**
 * Detect language from file extension
 */
export function detectLanguageFromExtension(filename: string): LanguageInfo | null {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (!ext) return null;

    return LANGUAGE_MAP[ext] || null;
}

/**
 * Detect language from code content patterns
 */
export function detectLanguageFromCode(code: string): LanguageInfo | null {
    const lines = code.trim().split('\n').slice(0, 20); // Check first 20 lines
    const codeSnippet = lines.join('\n');

    for (const [lang, patterns] of Object.entries(CODE_PATTERNS)) {
        const matchCount = patterns.filter(pattern => pattern.test(codeSnippet)).length;
        if (matchCount >= 2) {
            // Find language info by ID
            const langInfo = Object.values(LANGUAGE_MAP).find(l => l.id === lang);
            if (langInfo) return langInfo;
        }
    }

    return null;
}

/**
 * Detect language from markdown code block
 */
export function detectLanguageFromCodeBlock(codeBlockLang: string): LanguageInfo | null {
    const normalized = codeBlockLang.toLowerCase().trim();

    // Direct match
    if (LANGUAGE_MAP[normalized]) {
        return LANGUAGE_MAP[normalized];
    }

    // Find by ID
    const byId = Object.values(LANGUAGE_MAP).find(l => l.id === normalized);
    if (byId) return byId;

    // Find by name (case-insensitive)
    const byName = Object.values(LANGUAGE_MAP).find(
        l => l.name.toLowerCase() === normalized
    );
    if (byName) return byName;

    return null;
}

/**
 * Main detection function - tries multiple strategies
 */
export function detectLanguage(
    options: {
        filename?: string;
        code?: string;
        explicitLang?: string;
    }
): LanguageInfo {
    const { filename, code, explicitLang } = options;

    // 1. Try explicit language from code block
    if (explicitLang) {
        const lang = detectLanguageFromCodeBlock(explicitLang);
        if (lang) return lang;
    }

    // 2. Try filename extension
    if (filename) {
        const lang = detectLanguageFromExtension(filename);
        if (lang) return lang;
    }

    // 3. Try code pattern detection
    if (code) {
        const lang = detectLanguageFromCode(code);
        if (lang) return lang;
    }

    // 4. Default fallback
    return {
        id: 'text',
        name: 'Plain Text',
        extension: 'txt',
        icon: '📄'
    };
}

/**
 * Get all supported languages
 */
export function getSupportedLanguages(): LanguageInfo[] {
    return Object.values(LANGUAGE_MAP);
}
