'use client';

import { Github, ExternalLink, FileText, Info, Shield, Lightbulb, AlertTriangle } from 'lucide-react';

const demoResult = {
  repository: {
    name: "facebook/react",
    description: "The library for web and native user interfaces.",
    language: "JavaScript",
    stars: 228000,
    forks: 46800,
    url: "https://github.com/facebook/react"
  },
  structure: {
    files: [
      "package.json",
      "README.md",
      "LICENSE",
      "CHANGELOG.md",
      ".gitignore",
      "babel.config.js",
      "jest.config.js",
      "rollup.config.js",
      "scripts/build.js",
      "packages/react/index.js"
    ],
    directories: ["packages", "scripts", "fixtures", "docs", ".github"],
    totalFiles: 2847
  },
  techStack: {
    languages: ["JavaScript", "TypeScript"],
    frameworks: ["React", "Jest", "Babel"],
    dependencies: {
      "loose-envify": "^1.1.0",
      "scheduler": "^0.23.0"
    },
    devDependencies: {
      "@babel/core": "^7.0.0",
      "jest": "^29.0.0",
      "rollup": "^3.0.0"
    }
  },
  security: {
    risks: [
      {
        level: "medium" as const,
        message: "Large number of dependencies may increase attack surface",
        file: "package.json"
      }
    ],
    score: 85
  },
  suggestions: [
    {
      category: "Testing",
      message: "Excellent test coverage detected. Consider adding more integration tests.",
      priority: "low" as const
    },
    {
      category: "Documentation",
      message: "Great documentation! Consider adding more code examples.",
      priority: "low" as const
    },
    {
      category: "Performance",
      message: "Consider implementing tree-shaking optimizations for better bundle size.",
      priority: "medium" as const
    }
  ]
};

interface DemoResultsProps {
  onTryDemo: () => void;
}

export function DemoResults({ onTryDemo }: DemoResultsProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Demo Banner */}
      <div className="bg-accent-yellow/10 border border-accent-yellow/20 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Github className="w-5 h-5 text-accent-yellow" />
            <span className="font-semibold text-foreground">Demo Analysis Results</span>
            <span className="text-sm text-foreground/60">(Example: React Repository)</span>
          </div>
          <button
            onClick={onTryDemo}
            className="px-4 py-2 bg-accent-yellow text-[#10162F] font-semibold rounded-lg hover:bg-accent-yellow/90 transition-colors text-sm"
          >
            Try Your Own Repository
          </button>
        </div>
      </div>

      {/* Repository Info */}
      <div className="bg-card-bg border border-gray-800 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">{demoResult.repository.name}</h2>
            <p className="text-foreground/70 mb-3">{demoResult.repository.description}</p>
            <div className="flex items-center gap-4 text-sm text-foreground/60">
              <span>⭐ {demoResult.repository.stars.toLocaleString()}</span>
              <span>🍴 {demoResult.repository.forks.toLocaleString()}</span>
              <span>📝 {demoResult.repository.language}</span>
            </div>
          </div>
          <a
            href={demoResult.repository.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-foreground/10 hover:bg-foreground/20 rounded-lg text-foreground/80 hover:text-foreground transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View on GitHub
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Structure */}
        <div className="bg-card-bg border border-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-accent-yellow" />
            <h3 className="text-xl font-semibold text-foreground">Project Structure</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-foreground/70">Total Files:</span>
              <span className="font-semibold text-foreground">{demoResult.structure.totalFiles.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/70">Directories:</span>
              <span className="font-semibold text-foreground">{demoResult.structure.directories.length}</span>
            </div>
            <div>
              <span className="text-foreground/70 block mb-2">Key Files:</span>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {demoResult.structure.files.map((file, index) => (
                  <div key={index} className="text-sm text-foreground/60 font-mono">
                    {file}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-card-bg border border-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-accent-yellow" />
            <h3 className="text-xl font-semibold text-foreground">Tech Stack</h3>
          </div>
          <div className="space-y-4">
            <div>
              <span className="text-foreground/70 block mb-2">Languages:</span>
              <div className="flex flex-wrap gap-2">
                {demoResult.techStack.languages.map((lang, index) => (
                  <span key={index} className="px-2 py-1 bg-accent-yellow/10 text-accent-yellow rounded text-sm">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-foreground/70 block mb-2">Frameworks:</span>
              <div className="flex flex-wrap gap-2">
                {demoResult.techStack.frameworks.map((framework, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-sm">
                    {framework}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-foreground/70 block mb-2">Dependencies:</span>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {Object.entries(demoResult.techStack.dependencies).map(([name, version]) => (
                  <div key={name} className="flex justify-between text-sm">
                    <span className="text-foreground/60">{name}</span>
                    <span className="text-foreground/50 font-mono">{version}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Analysis */}
        <div className="bg-card-bg border border-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-accent-yellow" />
            <h3 className="text-xl font-semibold text-foreground">Security Analysis</h3>
            <div className="ml-auto">
              <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm font-semibold">
                Score: {demoResult.security.score}/100
              </span>
            </div>
          </div>
          <div className="space-y-3">
            {demoResult.security.risks.map((risk, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-background/50 rounded-lg">
                <AlertTriangle className={`w-4 h-4 mt-0.5 ${getRiskColor(risk.level)}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-sm font-semibold ${getRiskColor(risk.level)}`}>
                      {risk.level.toUpperCase()}
                    </span>
                    {risk.file && (
                      <span className="text-xs text-foreground/50 font-mono">{risk.file}</span>
                    )}
                  </div>
                  <p className="text-sm text-foreground/70">{risk.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Improvement Suggestions */}
        <div className="bg-card-bg border border-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-accent-yellow" />
            <h3 className="text-xl font-semibold text-foreground">Improvement Suggestions</h3>
          </div>
          <div className="space-y-3">
            {demoResult.suggestions.map((suggestion, index) => (
              <div key={index} className="p-3 bg-background/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(suggestion.priority)}`}>
                    {suggestion.priority.toUpperCase()}
                  </span>
                  <span className="text-sm font-medium text-foreground/80">{suggestion.category}</span>
                </div>
                <p className="text-sm text-foreground/70">{suggestion.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}