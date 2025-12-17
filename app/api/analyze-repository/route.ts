import { NextRequest, NextResponse } from 'next/server';

interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url?: string;
}

interface GitHubRepo {
  name: string;
  full_name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Repository URL is required and must be a string' }, { status: 400 });
    }

    // Extract owner and repo from GitHub URL with better validation
    const match = url.trim().match(/github\.com\/([^\/\s]+)\/([^\/\s]+)/);
    if (!match) {
      return NextResponse.json({ 
        error: 'Invalid GitHub URL. Please provide a valid GitHub repository URL (e.g., https://github.com/owner/repo)' 
      }, { status: 400 });
    }

    const [, owner, repo] = match;
    const repoName = repo.replace(/\.git$/, '').replace(/\/$/, '');

    // Validate owner and repo names
    if (!owner || !repoName || owner.length === 0 || repoName.length === 0) {
      return NextResponse.json({ 
        error: 'Invalid repository owner or name in the URL' 
      }, { status: 400 });
    }

    // Fetch repository information
    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Project-Analyzer'
      },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    if (!repoResponse.ok) {
      if (repoResponse.status === 403) {
        throw new Error('GitHub API rate limit exceeded. Please try again later.');
      }
      if (repoResponse.status === 404) {
        throw new Error('Repository not found or is private');
      }
      throw new Error(`GitHub API error: ${repoResponse.status}`);
    }

    const repoData: GitHubRepo = await repoResponse.json();

    // Fetch repository contents
    const contentsResponse = await fetch(`https://api.github.com/repos/${owner}/${repoName}/contents`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Project-Analyzer'
      },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    if (!contentsResponse.ok) {
      if (contentsResponse.status === 403) {
        throw new Error('GitHub API rate limit exceeded. Please try again later.');
      }
      throw new Error(`Failed to fetch repository contents: ${contentsResponse.status}`);
    }

    const contents: GitHubFile[] = await contentsResponse.json();
    
    // Validate contents is an array
    if (!Array.isArray(contents)) {
      throw new Error('Invalid repository structure received from GitHub API');
    }

    // Analyze project structure
    const files = contents.filter(item => item.type === 'file').map(item => item.name);
    const directories = contents.filter(item => item.type === 'dir').map(item => item.name);

    // Detect tech stack
    const techStack = await detectTechStack(owner, repoName, files);

    // Perform security analysis
    const security = await performSecurityAnalysis(owner, repoName, files);

    // Generate improvement suggestions
    const suggestions = generateSuggestions(files, techStack, security);

    const result = {
      repository: {
        name: repoData.full_name || `${owner}/${repoName}`,
        description: repoData.description || 'No description available',
        language: repoData.language || 'Unknown',
        stars: repoData.stargazers_count || 0,
        forks: repoData.forks_count || 0,
        url: repoData.html_url || `https://github.com/${owner}/${repoName}`,
      },
      structure: {
        files: files.slice(0, 20), // Limit to first 20 files
        directories: directories || [],
        totalFiles: files.length,
      },
      techStack: techStack || {
        languages: ['Unknown'],
        frameworks: ['None detected'],
        dependencies: {},
        devDependencies: {}
      },
      security: security || {
        risks: [],
        score: 0
      },
      suggestions: suggestions || [],
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'Request timeout. The repository might be too large or GitHub API is slow. Please try again.' },
          { status: 408 }
        );
      }
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'GitHub API rate limit exceeded. Please try again in a few minutes.' },
          { status: 429 }
        );
      }
      if (error.message.includes('not found') || error.message.includes('private')) {
        return NextResponse.json(
          { error: 'Repository not found or is not publicly accessible.' },
          { status: 404 }
        );
      }
      if (error.message.includes('network') || error.message.includes('fetch')) {
        return NextResponse.json(
          { error: 'Network error occurred. Please check your connection and try again.' },
          { status: 503 }
        );
      }
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Repository analysis failed. Please check the URL and try again.' },
      { status: 500 }
    );
  }
}

async function detectTechStack(owner: string, repo: string, files: string[]) {
  const languages: string[] = [];
  const frameworks: string[] = [];
  const dependencies: Record<string, string> = {};
  const devDependencies: Record<string, string> = {};

  // Detect languages from file extensions
  const languageMap: Record<string, string> = {
    '.js': 'JavaScript',
    '.ts': 'TypeScript',
    '.jsx': 'React',
    '.tsx': 'React TypeScript',
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
  };

  files.forEach(file => {
    const ext = file.substring(file.lastIndexOf('.'));
    if (languageMap[ext] && !languages.includes(languageMap[ext])) {
      languages.push(languageMap[ext]);
    }
  });

  // Detect frameworks and dependencies from specific files
  try {
    // Check package.json for Node.js projects
    if (files.includes('package.json')) {
      try {
        const packageResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/package.json`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Project-Analyzer'
          },
          signal: AbortSignal.timeout(8000) // 8 second timeout for package.json
        });
        
        if (packageResponse.ok) {
          const packageData = await packageResponse.json();
          
          // Validate packageData structure
          if (packageData && packageData.content && packageData.encoding === 'base64') {
            try {
              const decodedContent = atob(packageData.content.replace(/\s/g, ''));
              const content = JSON.parse(decodedContent);
              
              if (content && typeof content === 'object') {
                if (content.dependencies && typeof content.dependencies === 'object') {
                  Object.assign(dependencies, content.dependencies);
                  
                  // Detect frameworks from dependencies
                  if (content.dependencies.react) frameworks.push('React');
                  if (content.dependencies.next) frameworks.push('Next.js');
                  if (content.dependencies.vue) frameworks.push('Vue.js');
                  if (content.dependencies.angular) frameworks.push('Angular');
                  if (content.dependencies.express) frameworks.push('Express.js');
                  if (content.dependencies.fastify) frameworks.push('Fastify');
                  if (content.dependencies.nestjs) frameworks.push('NestJS');
                }
                
                if (content.devDependencies && typeof content.devDependencies === 'object') {
                  Object.assign(devDependencies, content.devDependencies);
                }
              }
            } catch (parseError) {
              console.warn('Failed to parse package.json:', parseError);
            }
          }
        }
      } catch (fetchError) {
        console.warn('Failed to fetch package.json:', fetchError);
      }
    }

    // Check requirements.txt for Python projects
    if (files.includes('requirements.txt')) {
      frameworks.push('Python');
      // Could fetch and parse requirements.txt for Python dependencies
    }

    // Check pom.xml for Java projects
    if (files.includes('pom.xml')) {
      frameworks.push('Maven');
    }

    // Check Cargo.toml for Rust projects
    if (files.includes('Cargo.toml')) {
      frameworks.push('Cargo');
    }

    // Check go.mod for Go projects
    if (files.includes('go.mod')) {
      frameworks.push('Go Modules');
    }

  } catch (error) {
    console.error('Error detecting tech stack:', error);
  }

  return {
    languages: languages.length > 0 ? languages : ['Unknown'],
    frameworks: frameworks.length > 0 ? frameworks : ['None detected'],
    dependencies,
    devDependencies,
  };
}

async function performSecurityAnalysis(owner: string, repo: string, files: string[]) {
  const risks: Array<{
    level: 'high' | 'medium' | 'low';
    message: string;
    file?: string;
  }> = [];

  let score = 100;

  // Check for common security files
  const securityFiles = [
    'SECURITY.md',
    '.github/SECURITY.md',
    'security.txt',
    '.well-known/security.txt'
  ];

  const hasSecurityPolicy = files.some(file => 
    securityFiles.some(secFile => file.toLowerCase().includes(secFile.toLowerCase()))
  );

  if (!hasSecurityPolicy) {
    risks.push({
      level: 'medium',
      message: 'No security policy found. Consider adding a SECURITY.md file.',
    });
    score -= 10;
  }

  // Check for dependency management
  if (files.includes('package.json') && !files.includes('package-lock.json') && !files.includes('yarn.lock')) {
    risks.push({
      level: 'medium',
      message: 'No lock file found. This can lead to dependency version inconsistencies.',
      file: 'package.json'
    });
    score -= 15;
  }

  // Check for environment files
  if (files.includes('.env')) {
    risks.push({
      level: 'high',
      message: 'Environment file (.env) found in repository. This may contain sensitive information.',
      file: '.env'
    });
    score -= 25;
  }

  // Check for common sensitive files
  const sensitiveFiles = [
    'id_rsa',
    'id_dsa',
    'private.key',
    'server.key',
    'config.json',
    'secrets.json'
  ];

  sensitiveFiles.forEach(sensitiveFile => {
    if (files.some(file => file.toLowerCase().includes(sensitiveFile))) {
      risks.push({
        level: 'high',
        message: `Potentially sensitive file detected: ${sensitiveFile}`,
        file: sensitiveFile
      });
      score -= 20;
    }
  });

  // Check for README
  const hasReadme = files.some(file => file.toLowerCase().startsWith('readme'));
  if (!hasReadme) {
    risks.push({
      level: 'low',
      message: 'No README file found. Documentation is important for security and maintenance.',
    });
    score -= 5;
  }

  // Check for license
  const hasLicense = files.some(file => file.toLowerCase().includes('license'));
  if (!hasLicense) {
    risks.push({
      level: 'low',
      message: 'No license file found. This may cause legal and security concerns.',
    });
    score -= 5;
  }

  return {
    risks,
    score: Math.max(0, score),
  };
}

function generateSuggestions(
  files: string[], 
  techStack: { 
    languages: string[]; 
    frameworks: string[]; 
    dependencies: Record<string, string>; 
    devDependencies: Record<string, string>; 
  }, 
  security: { 
    risks: Array<{ level: 'high' | 'medium' | 'low'; message: string; file?: string }>; 
    score: number; 
  }
) {
  const suggestions: Array<{
    category: string;
    message: string;
    priority: 'high' | 'medium' | 'low';
  }> = [];

  // Documentation suggestions
  const hasReadme = files.some(file => file.toLowerCase().startsWith('readme'));
  if (!hasReadme) {
    suggestions.push({
      category: 'Documentation',
      message: 'Add a comprehensive README.md file with project description, setup instructions, and usage examples.',
      priority: 'high'
    });
  }

  // Testing suggestions
  const hasTests = files.some(file => 
    file.includes('test') || 
    file.includes('spec') || 
    file.includes('__tests__')
  );
  
  if (!hasTests) {
    suggestions.push({
      category: 'Testing',
      message: 'Consider adding unit tests to improve code quality and reliability.',
      priority: 'medium'
    });
  }

  // CI/CD suggestions
  const hasCICD = files.some(file => 
    file.includes('.github/workflows') || 
    file.includes('.gitlab-ci') || 
    file.includes('Jenkinsfile') ||
    file.includes('.travis.yml')
  );

  if (!hasCICD) {
    suggestions.push({
      category: 'DevOps',
      message: 'Set up continuous integration/deployment (CI/CD) pipeline for automated testing and deployment.',
      priority: 'medium'
    });
  }

  // Security suggestions based on analysis
  if (security.score < 80) {
    suggestions.push({
      category: 'Security',
      message: 'Review and address security risks to improve overall security score.',
      priority: 'high'
    });
  }

  // Dependency management
  if (files.includes('package.json')) {
    suggestions.push({
      category: 'Dependencies',
      message: 'Regularly update dependencies and use tools like npm audit to check for vulnerabilities.',
      priority: 'medium'
    });
  }

  // Code quality suggestions
  const hasLinting = files.some(file => 
    file.includes('eslint') || 
    file.includes('prettier') || 
    file.includes('tslint')
  );

  if (!hasLinting) {
    suggestions.push({
      category: 'Code Quality',
      message: 'Add linting tools (ESLint, Prettier) to maintain consistent code style and catch potential issues.',
      priority: 'low'
    });
  }

  // Performance suggestions
  if (techStack.frameworks.includes('React') || techStack.frameworks.includes('Next.js')) {
    suggestions.push({
      category: 'Performance',
      message: 'Consider implementing code splitting and lazy loading for better performance.',
      priority: 'low'
    });
  }

  return suggestions;
}