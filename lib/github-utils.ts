export interface GitHubRepository {
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  private: boolean;
  default_branch: string;
}

export interface GitHubContent {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size?: number;
  download_url?: string | null;
  content?: string;
  encoding?: string;
}

export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) return null;
  
  const [, owner, repo] = match;
  return {
    owner,
    repo: repo.replace(/\.git$/, '')
  };
}

export function isValidGitHubUrl(url: string): boolean {
  const githubUrlPattern = /^https:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+\/?$/;
  return githubUrlPattern.test(url.trim());
}

export function getFileExtension(filename: string): string {
  return filename.substring(filename.lastIndexOf('.'));
}

export function isConfigFile(filename: string): boolean {
  const configFiles = [
    'package.json',
    'package-lock.json',
    'yarn.lock',
    'requirements.txt',
    'Pipfile',
    'pom.xml',
    'build.gradle',
    'Cargo.toml',
    'go.mod',
    'composer.json',
    'Gemfile',
    'setup.py',
    'pyproject.toml'
  ];
  
  return configFiles.includes(filename.toLowerCase());
}

export function isDocumentationFile(filename: string): boolean {
  const docFiles = [
    'readme.md',
    'readme.txt',
    'readme.rst',
    'changelog.md',
    'changelog.txt',
    'license',
    'license.md',
    'license.txt',
    'contributing.md',
    'code_of_conduct.md',
    'security.md'
  ];
  
  return docFiles.includes(filename.toLowerCase());
}

export function isSensitiveFile(filename: string): boolean {
  const sensitivePatterns = [
    /\.env$/i,
    /\.env\./i,
    /config\.json$/i,
    /secrets?\.json$/i,
    /private.*\.key$/i,
    /id_rsa$/i,
    /id_dsa$/i,
    /\.pem$/i,
    /\.p12$/i,
    /\.pfx$/i,
    /password/i,
    /secret/i
  ];
  
  return sensitivePatterns.some(pattern => pattern.test(filename));
}

export function detectLanguageFromExtension(extension: string): string | null {
  const languageMap: Record<string, string> = {
    '.js': 'JavaScript',
    '.jsx': 'JavaScript (React)',
    '.ts': 'TypeScript',
    '.tsx': 'TypeScript (React)',
    '.py': 'Python',
    '.java': 'Java',
    '.cpp': 'C++',
    '.c': 'C',
    '.cs': 'C#',
    '.php': 'PHP',
    '.rb': 'Ruby',
    '.go': 'Go',
    '.rs': 'Rust',
    '.swift': 'Swift',
    '.kt': 'Kotlin',
    '.dart': 'Dart',
    '.vue': 'Vue.js',
    '.svelte': 'Svelte',
    '.html': 'HTML',
    '.css': 'CSS',
    '.scss': 'SCSS',
    '.sass': 'Sass',
    '.less': 'Less',
    '.sql': 'SQL',
    '.sh': 'Shell',
    '.bash': 'Bash',
    '.ps1': 'PowerShell',
    '.r': 'R',
    '.scala': 'Scala',
    '.clj': 'Clojure',
    '.elm': 'Elm',
    '.ex': 'Elixir',
    '.fs': 'F#',
    '.hs': 'Haskell',
    '.lua': 'Lua',
    '.m': 'Objective-C',
    '.pl': 'Perl',
    '.vim': 'Vim Script'
  };
  
  return languageMap[extension.toLowerCase()] || null;
}

export function calculateSecurityScore(factors: {
  hasSecurityPolicy: boolean;
  hasLockFile: boolean;
  hasLicense: boolean;
  hasReadme: boolean;
  sensitiveFilesCount: number;
  dependenciesCount: number;
}): number {
  let score = 100;
  
  // Deduct points for missing security essentials
  if (!factors.hasSecurityPolicy) score -= 10;
  if (!factors.hasLockFile) score -= 15;
  if (!factors.hasLicense) score -= 5;
  if (!factors.hasReadme) score -= 5;
  
  // Deduct points for sensitive files (major risk)
  score -= factors.sensitiveFilesCount * 25;
  
  // Deduct points for too many dependencies (minor risk)
  if (factors.dependenciesCount > 50) score -= 10;
  if (factors.dependenciesCount > 100) score -= 10;
  
  return Math.max(0, Math.min(100, score));
}

export function generateImprovementSuggestions(analysis: {
  hasReadme: boolean;
  hasTests: boolean;
  hasCICD: boolean;
  hasLinting: boolean;
  securityScore: number;
  techStack: string[];
}): Array<{
  category: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
}> {
  const suggestions = [];
  
  if (!analysis.hasReadme) {
    suggestions.push({
      category: 'Documentation',
      message: 'Add a comprehensive README.md with setup instructions and usage examples.',
      priority: 'high' as const
    });
  }
  
  if (!analysis.hasTests) {
    suggestions.push({
      category: 'Testing',
      message: 'Implement unit tests to improve code reliability and maintainability.',
      priority: 'medium' as const
    });
  }
  
  if (!analysis.hasCICD) {
    suggestions.push({
      category: 'DevOps',
      message: 'Set up CI/CD pipeline for automated testing and deployment.',
      priority: 'medium' as const
    });
  }
  
  if (!analysis.hasLinting) {
    suggestions.push({
      category: 'Code Quality',
      message: 'Add linting tools (ESLint, Prettier) for consistent code style.',
      priority: 'low' as const
    });
  }
  
  if (analysis.securityScore < 80) {
    suggestions.push({
      category: 'Security',
      message: 'Address security vulnerabilities to improve overall security posture.',
      priority: 'high' as const
    });
  }
  
  if (analysis.techStack.includes('React') || analysis.techStack.includes('Next.js')) {
    suggestions.push({
      category: 'Performance',
      message: 'Consider implementing code splitting and lazy loading for better performance.',
      priority: 'low' as const
    });
  }
  
  return suggestions;
}