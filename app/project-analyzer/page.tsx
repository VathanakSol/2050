'use client';

import { useState } from 'react';
import { Github, Search, AlertTriangle, CheckCircle, Info, ExternalLink, FileText, Shield, Lightbulb } from 'lucide-react';
import { ProjectTree } from '@/components/project-analyzer/ProjectTree';

interface AnalysisResult {
  repository: {
    name: string;
    description: string;
    language: string;
    stars: number;
    forks: number;
    url: string;
  };
  structure: {
    files: string[];
    directories: string[];
    totalFiles: number;
  };
  techStack: {
    languages: string[];
    frameworks: string[];
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  };
  security: {
    risks: Array<{
      level: 'high' | 'medium' | 'low';
      message: string;
      file?: string;
    }>;
    score: number;
  };
  suggestions: Array<{
    category: string;
    message: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

type TabType = 'structure' | 'techstack' | 'security' | 'suggestions';

export default function ProjectAnalyzer() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [showDemo, setShowDemo] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('structure');

  const analyzeRepository = async () => {
    if (!url.trim()) {
      setError('Please enter a GitHub repository URL');
      return;
    }

    // Validate GitHub URL
    const githubUrlPattern = /^https:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+\/?$/;
    if (!githubUrlPattern.test(url.trim())) {
      setError('Please enter a valid GitHub repository URL (e.g., https://github.com/user/repo)');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/analyze-repository', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
      setShowDemo(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-3 py-4">

        {/* Input Section */}
        <div className="rounded-lg mb-6 pt-4">
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="repo-url" className="block text-sm font-medium text-accent-yellow mb-2">
                Repository URL
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ExternalLink className="h-4 w-4 text-foreground/40" />
                  </div>
                  <input
                    id="repo-url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://github.com/username/repository"
                    className="block w-full p-2 pl-12 pr-3 text-sm text-gray-900 bg-white border-2 border-gray-200 focus:border-accent-yellow outline-none transition-all shadow-[4px_4px_0px_0px_#e0e0e0] focus:shadow-[4px_4px_0px_0px_#FFD300]"
                    onKeyDown={(e) => e.key === 'Enter' && analyzeRepository()}
                  />
                </div>
                <button
                  onClick={analyzeRepository}
                  disabled={loading}
                  className="group relative flex-1 sm:flex-none justify-center bg-gradient-to-br from-[#FFD300] to-[#FFC700] text-[#10162F] px-4 sm:px-6 py-2.5 font-black uppercase tracking-wider border-2 border-white shadow-[6px_6px_0px_0px_rgba(255,255,255,0.9)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.7)] active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 whitespace-nowrap flex items-center gap-2 text-sm overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#10162F]/30 border-t-[#10162F] rounded-full animate-spin relative z-10" />
                      <span className="relative z-10">Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 relative z-10" />
                      <span className="relative z-10">Analyze</span>
                    </>
                  )}
                </button>
              </div>
              <p className="pt-2 text-xs">Available now only: <span className="font-semibold">GitHub</span></p>
            </div>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-red-400 font-medium text-xs mb-1">Error</div>
                <div className="text-red-400/80 text-xs">{error}</div>
              </div>
            </div>
          )}
        </div>


        {/* Results */}
        {result && (
          <div className="space-y-4">

            {/* Repository Info */}
            <div className="relative bg-white border-2 border-gray-200 p-4 overflow-hidden shadow-[4px_4px_0px_0px_#e0e0e0]"> 
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-lg font-black text-gray-900 tracking-tight">{result.repository.name}</h2>
                    </div>
                    <p className="text-gray-600 mb-3 text-xs leading-relaxed max-w-2xl">{result.repository.description}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 px-2 py-1.5 bg-gray-50 backdrop-blur-sm rounded border border-gray-200">
                        <div className="w-1.5 h-1.5 bg-accent-yellow rounded-full"></div>
                        <span className="text-gray-900 text-xs font-semibold">{result.repository.stars}</span>
                        <span className="text-gray-500 text-xs">stars</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1.5 bg-gray-50 backdrop-blur-sm rounded border border-gray-200">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-900 text-xs font-semibold">{result.repository.forks}</span>
                        <span className="text-gray-500 text-xs">forks</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1.5 bg-gray-50 backdrop-blur-sm rounded border border-gray-200">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                        <span className="text-gray-900 text-xs font-semibold">{result.repository.language}</span>
                      </div>
                    </div>
                  </div>
                  <a
                    href={result.repository.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-1.5 px-3 py-2 text-[#10162F] rounded font-bold text-xs transition-all duration-300 hover:-translate-y-0.5 border border-gray-200"
                  >
                    <ExternalLink className="w-3 h-3 transition-transform duration-300" />  
                  </a>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-card-bg border border-gray-800 rounded-lg overflow-hidden">
              <div className="flex border-b border-gray-700 overflow-x-auto scrollbar-thin">
                {[
                  {
                    id: 'structure',
                    label: 'Project Structure',
                    icon: FileText,
                    shortLabel: 'Structure',
                    count: result.structure.totalFiles
                  },
                  {
                    id: 'techstack',
                    label: 'Tech Stack',
                    icon: Info,
                    shortLabel: 'Tech Stack',
                    count: result.techStack.languages.length + result.techStack.frameworks.length
                  },
                  {
                    id: 'security',
                    label: 'Security Analysis',
                    icon: Shield,
                    shortLabel: 'Security',
                    count: result.security.risks.length,
                    badge: result.security.score
                  },
                  {
                    id: 'suggestions',
                    label: 'Suggestions',
                    icon: Lightbulb,
                    shortLabel: 'Suggestions',
                    count: result.suggestions.length
                  }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`flex-1 min-w-0 flex flex-col sm:flex-row items-center justify-center gap-1 px-2 sm:px-4 py-2 sm:py-3 text-xs font-medium transition-all duration-200 whitespace-nowrap ${activeTab === tab.id
                        ? 'bg-accent-yellow text-[#10162F] border-b-2 border-accent-yellow'
                        : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
                        }`}
                    >
                      <div className="flex items-center gap-1">
                        <Icon className="w-3 h-3 flex-shrink-0" />
                        <span className="hidden md:inline">{tab.label}</span>
                        <span className="md:hidden">{tab.shortLabel}</span>
                        {tab.count !== undefined && tab.count > 0 && (
                          <span className={`text-xs px-1 py-0.5 rounded-full font-semibold ${activeTab === tab.id
                            ? 'bg-[#10162F]/20 text-[#10162F]'
                            : 'bg-accent-yellow/20 text-accent-yellow'
                            }`}>
                            {tab.id === 'security' && tab.badge ? `${tab.badge}/100` : tab.count}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="p-3 sm:p-4 min-h-[300px]">
                {activeTab === 'structure' && (
                  <div className="animate-in fade-in duration-300">
                    <div className="mb-3">
                      <h3 className="text-base font-semibold text-foreground mb-1">Project Structure</h3>
                      <p className="text-foreground/60 text-xs">
                        Interactive tree view of your repository structure with {result.structure.totalFiles} files across {result.structure.directories.length} directories.
                      </p>
                    </div>
                    <ProjectTree
                      files={result.structure.files}
                      directories={result.structure.directories}
                      totalFiles={result.structure.totalFiles}
                    />
                  </div>
                )}

                {activeTab === 'techstack' && (
                  <div className="animate-in fade-in duration-300 space-y-4">
                    <div className="mb-4">
                      <h3 className="text-base font-semibold text-foreground mb-1">Technology Stack</h3>
                      <p className="text-foreground/60 text-xs">
                        Overview of programming languages, frameworks, and dependencies used in this project.
                      </p>
                    </div>

                    <div>
                      <span className="text-foreground/70 block mb-2 text-sm font-medium">Languages</span>
                      <div className="flex flex-wrap gap-2">
                        {result.techStack.languages.map((lang, index) => (
                          <span key={index} className="px-3 py-1 bg-accent-yellow/10 text-accent-yellow rounded-lg text-xs font-medium">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-foreground/70 block mb-2 text-sm font-medium">Frameworks</span>
                      <div className="flex flex-wrap gap-2">
                        {result.techStack.frameworks.map((framework, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-medium">
                            {framework}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-foreground/70 block mb-2 text-sm font-medium">Dependencies</span>
                      <div className="bg-background/50 rounded-lg p-3 max-h-80 overflow-y-auto scrollbar-thin">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {Object.entries(result.techStack.dependencies).map(([name, version]) => (
                            <div key={name} className="flex justify-between items-center p-2 bg-card-bg rounded-lg border border-gray-700/50">
                              <span className="text-foreground/80 font-medium text-xs">{name}</span>
                              <span className="text-foreground/60 font-mono text-xs bg-foreground/5 px-1.5 py-0.5 rounded">{version}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="animate-in fade-in duration-300">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-base font-semibold text-foreground">Security Analysis</h3>
                        <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-semibold">
                          Score: {result.security.score}/100
                        </span>
                      </div>
                      <p className="text-foreground/60 text-xs">
                        Security assessment of your repository including potential risks and vulnerabilities.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {result.security.risks.length === 0 ? (
                        <div className="flex items-center justify-center gap-2 text-green-400 py-8 bg-green-500/5 rounded-lg border border-green-500/20">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">No security risks detected</span>
                        </div>
                      ) : (
                        result.security.risks.map((risk, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-background/50 rounded-lg border border-gray-700/50">
                            <AlertTriangle className={`w-4 h-4 mt-0.5 ${getRiskColor(risk.level)}`} />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-bold uppercase ${getRiskColor(risk.level)}`}>
                                  {risk.level} Risk
                                </span>
                                {risk.file && (
                                  <span className="text-xs text-foreground/50 font-mono bg-foreground/5 px-1.5 py-0.5 rounded">
                                    {risk.file}
                                  </span>
                                )}
                              </div>
                              <p className="text-foreground/80 text-xs">{risk.message}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'suggestions' && (
                  <div className="animate-in fade-in duration-300">
                    <div className="mb-4">
                      <h3 className="text-base font-semibold text-foreground mb-1">Improvement Suggestions</h3>
                      <p className="text-foreground/60 text-xs">
                        Actionable recommendations to enhance your project&apos;s quality, performance, and maintainability.
                      </p>
                    </div>
                    <div className="space-y-3">
                      {result.suggestions.map((suggestion, index) => (
                        <div key={index} className="p-3 bg-background/50 rounded-lg border border-gray-700/50">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${getPriorityColor(suggestion.priority)}`}>
                              {suggestion.priority} Priority
                            </span>
                            <span className="text-xs font-semibold text-foreground/90 bg-accent-yellow/10 px-2 py-0.5 rounded-full">
                              {suggestion.category}
                            </span>
                          </div>
                          <p className="text-foreground/80 leading-relaxed text-xs">{suggestion.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}