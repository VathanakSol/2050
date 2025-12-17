# Project Analyzer

A comprehensive GitHub repository analysis tool that provides insights into project structure, tech stack, security risks, and improvement suggestions.

## Features

### 🔍 Repository Analysis
- **Project Structure**: Analyze file organization, directory structure, and project size
- **Tech Stack Detection**: Automatically detect programming languages, frameworks, and dependencies
- **Security Analysis**: Basic SAST (Static Application Security Testing) with risk scoring
- **Improvement Suggestions**: AI-powered recommendations for better code quality and practices

### 🛡️ Security Checks
- Environment file exposure detection
- Missing security policies
- Dependency management issues
- Sensitive file detection
- License and documentation checks

### 📊 Tech Stack Detection
- Programming languages from file extensions
- Framework detection from package.json, requirements.txt, etc.
- Dependency analysis and version tracking
- Development tools identification

## How to Use

1. **Enter GitHub URL**: Paste any public GitHub repository URL
2. **Click Analyze**: The tool will fetch and analyze the repository
3. **Review Results**: Get comprehensive insights across multiple categories
4. **Take Action**: Follow the improvement suggestions to enhance your project

## Example URLs to Try

- `https://github.com/vercel/next.js` - Next.js framework
- `https://github.com/microsoft/vscode` - VS Code editor
- `https://github.com/tailwindlabs/tailwindcss` - Tailwind CSS

## Tech Stack

### Frontend
- **Next.js 16** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Hooks** for state management

### Backend
- **Next.js API Routes** for GitHub integration
- **GitHub REST API** for repository data
- **Built-in security patterns** for SAST analysis

### Key Dependencies
- `@types/node` - TypeScript support
- `lucide-react` - Icon library
- Native `fetch` API for HTTP requests

## API Endpoints

### POST `/api/analyze-repository`

Analyzes a GitHub repository and returns comprehensive insights.

**Request Body:**
```json
{
  "url": "https://github.com/username/repository"
}
```

**Response:**
```json
{
  "repository": {
    "name": "username/repository",
    "description": "Repository description",
    "language": "JavaScript",
    "stars": 1000,
    "forks": 200,
    "url": "https://github.com/username/repository"
  },
  "structure": {
    "files": ["package.json", "README.md", "..."],
    "directories": ["src", "docs", "..."],
    "totalFiles": 150
  },
  "techStack": {
    "languages": ["JavaScript", "TypeScript"],
    "frameworks": ["React", "Next.js"],
    "dependencies": { "react": "^18.0.0" },
    "devDependencies": { "typescript": "^5.0.0" }
  },
  "security": {
    "risks": [
      {
        "level": "medium",
        "message": "No lock file found",
        "file": "package.json"
      }
    ],
    "score": 85
  },
  "suggestions": [
    {
      "category": "Testing",
      "message": "Add unit tests to improve code quality",
      "priority": "medium"
    }
  ]
}
```

## Security Analysis Categories

### Risk Levels
- **High**: Critical security issues that need immediate attention
- **Medium**: Important issues that should be addressed soon
- **Low**: Minor improvements for better security posture

### Checks Performed
- Environment file exposure (`.env` files)
- Missing security policies (`SECURITY.md`)
- Dependency lock files (`package-lock.json`, `yarn.lock`)
- Sensitive file detection (private keys, config files)
- Documentation completeness (README, LICENSE)

## Improvement Suggestions

### Categories
- **Documentation**: README, API docs, code comments
- **Testing**: Unit tests, integration tests, test coverage
- **Security**: Vulnerability fixes, security policies
- **Performance**: Optimization opportunities
- **Code Quality**: Linting, formatting, best practices
- **DevOps**: CI/CD, deployment automation

## Limitations

- Only analyzes public GitHub repositories
- Limited to repository root and first-level analysis
- Security analysis is basic pattern matching (not comprehensive SAST)
- Rate limited by GitHub API (60 requests per hour for unauthenticated)

## Future Enhancements

- [ ] GitHub authentication for private repositories
- [ ] Deeper file content analysis
- [ ] Integration with security vulnerability databases
- [ ] Code quality metrics (complexity, maintainability)
- [ ] Performance benchmarking suggestions
- [ ] Automated PR generation for improvements
- [ ] Support for other Git platforms (GitLab, Bitbucket)