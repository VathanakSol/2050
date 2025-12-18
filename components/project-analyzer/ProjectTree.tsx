'use client';

import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  File,
  FileText,
  FileCode,
  FileImage,
  Settings,
  Package,
  GitBranch,
  Database,
  Palette,
  Globe,
  Lock,
  Zap,
  Coffee,
  Layers,
  Terminal,
  Code2,
  Braces
} from 'lucide-react';

interface TreeNode {
  name: string;
  type: 'file' | 'directory';
  path: string;
  children?: TreeNode[];
  size?: number;
  extension?: string;
}

interface ProjectTreeProps {
  files: string[];
  directories: string[];
  totalFiles: number;
}

export function ProjectTree({ files, directories, totalFiles }: ProjectTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Build tree structure from flat file list
  const buildTree = (): TreeNode => {
    const root: TreeNode = {
      name: 'root',
      type: 'directory',
      path: '',
      children: []
    };

    const allPaths = [...files, ...directories].sort();

    allPaths.forEach(path => {
      const parts = path.split('/').filter(Boolean);
      let current = root;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const currentPath = parts.slice(0, i + 1).join('/');
        const isLast = i === parts.length - 1;
        const isFile = isLast && files.includes(path);

        let existing = current.children?.find(child => child.name === part);

        if (!existing) {
          existing = {
            name: part,
            type: isFile ? 'file' : 'directory',
            path: currentPath,
            children: isFile ? undefined : [],
            extension: isFile ? getFileExtension(part) : undefined
          };
          current.children = current.children || [];
          current.children.push(existing);
        }

        current = existing;
      }
    });

    // Sort children: directories first, then files
    const sortChildren = (node: TreeNode) => {
      if (node.children) {
        node.children.sort((a, b) => {
          if (a.type !== b.type) {
            return a.type === 'directory' ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        });
        node.children.forEach(sortChildren);
      }
    };

    sortChildren(root);
    return root;
  };

  const getFileExtension = (filename: string): string => {
    const lastDot = filename.lastIndexOf('.');
    return lastDot > 0 ? filename.substring(lastDot + 1).toLowerCase() : '';
  };

  const getFileIcon = (node: TreeNode) => {
    if (node.type === 'directory') {
      const isExpanded = expandedNodes.has(node.path);
      const name = node.name.toLowerCase();

      // Special directory icons
      if (name === 'src' || name === 'source') {
        return <Code2 className={`w-4 h-4 ${isExpanded ? 'text-blue-400' : 'text-blue-500'}`} />;
      }
      if (name === 'components' || name === 'component') {
        return <Layers className={`w-4 h-4 ${isExpanded ? 'text-purple-400' : 'text-purple-500'}`} />;
      }
      if (name === 'assets' || name === 'static' || name === 'public') {
        return <Palette className={`w-4 h-4 ${isExpanded ? 'text-pink-400' : 'text-pink-500'}`} />;
      }
      if (name === 'api' || name === 'server' || name === 'backend') {
        return <Globe className={`w-4 h-4 ${isExpanded ? 'text-green-400' : 'text-green-500'}`} />;
      }
      if (name === 'config' || name === 'configuration') {
        return <Settings className={`w-4 h-4 ${isExpanded ? 'text-gray-400' : 'text-gray-500'}`} />;
      }
      if (name === 'tests' || name === 'test' || name === '__tests__') {
        return <Zap className={`w-4 h-4 ${isExpanded ? 'text-yellow-400' : 'text-yellow-500'}`} />;
      }
      if (name === 'lib' || name === 'libs' || name === 'utils' || name === 'utilities') {
        return <Braces className={`w-4 h-4 ${isExpanded ? 'text-indigo-400' : 'text-indigo-500'}`} />;
      }

      return isExpanded ?
        <FolderOpen className="w-4 h-4 text-blue-400 drop-shadow-sm" /> :
        <Folder className="w-4 h-4 text-blue-500 drop-shadow-sm" />;
    }

    const ext = node.extension || '';
    const name = node.name.toLowerCase();

    // Special files with enhanced styling
    if (name === 'package.json') {
      return <Package className="w-4 h-4 text-emerald-500 drop-shadow-sm" />;
    }
    if (name === 'package-lock.json' || name === 'yarn.lock' || name === 'pnpm-lock.yaml') {
      return <Lock className="w-4 h-4 text-amber-600 drop-shadow-sm" />;
    }
    if (name === '.gitignore' || name === '.gitattributes') {
      return <GitBranch className="w-4 h-4 text-orange-500 drop-shadow-sm" />;
    }
    if (name === 'dockerfile' || name === 'docker-compose.yml') {
      return <Terminal className="w-4 h-4 text-blue-600 drop-shadow-sm" />;
    }
    if (name.includes('config') || name.includes('settings') || ext === 'env') {
      return <Settings className="w-4 h-4 text-slate-500 drop-shadow-sm" />;
    }
    if (name === 'readme.md' || name === 'readme.txt') {
      return <FileText className="w-4 h-4 text-sky-500 drop-shadow-sm" />;
    }

    // Enhanced extension-based icons
    switch (ext) {
      case 'js':
        return <Coffee className="w-4 h-4 text-yellow-500 drop-shadow-sm" />;
      case 'jsx':
        return <Coffee className="w-4 h-4 text-cyan-500 drop-shadow-sm" />;
      case 'ts':
        return <FileCode className="w-4 h-4 text-blue-600 drop-shadow-sm" />;
      case 'tsx':
        return <FileCode className="w-4 h-4 text-blue-500 drop-shadow-sm" />;
      case 'vue':
        return <FileCode className="w-4 h-4 text-green-500 drop-shadow-sm" />;
      case 'py':
        return <FileCode className="w-4 h-4 text-yellow-600 drop-shadow-sm" />;
      case 'java':
        return <Coffee className="w-4 h-4 text-red-600 drop-shadow-sm" />;
      case 'cpp':
      case 'c':
        return <FileCode className="w-4 h-4 text-blue-700 drop-shadow-sm" />;
      case 'cs':
        return <FileCode className="w-4 h-4 text-purple-600 drop-shadow-sm" />;
      case 'php':
        return <FileCode className="w-4 h-4 text-indigo-600 drop-shadow-sm" />;
      case 'rb':
        return <FileCode className="w-4 h-4 text-red-500 drop-shadow-sm" />;
      case 'go':
        return <FileCode className="w-4 h-4 text-cyan-600 drop-shadow-sm" />;
      case 'rs':
        return <FileCode className="w-4 h-4 text-orange-600 drop-shadow-sm" />;
      case 'html':
        return <Globe className="w-4 h-4 text-orange-500 drop-shadow-sm" />;
      case 'css':
      case 'scss':
      case 'sass':
      case 'less':
        return <Palette className="w-4 h-4 text-pink-500 drop-shadow-sm" />;
      case 'json':
        return <Braces className="w-4 h-4 text-yellow-600 drop-shadow-sm" />;
      case 'xml':
        return <FileCode className="w-4 h-4 text-green-600 drop-shadow-sm" />;
      case 'sql':
        return <Database className="w-4 h-4 text-blue-500 drop-shadow-sm" />;
      case 'md':
      case 'mdx':
        return <FileText className="w-4 h-4 text-blue-400 drop-shadow-sm" />;
      case 'txt':
      case 'doc':
      case 'docx':
        return <FileText className="w-4 h-4 text-gray-500 drop-shadow-sm" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'webp':
        return <FileImage className="w-4 h-4 text-purple-500 drop-shadow-sm" />;
      case 'svg':
        return <FileImage className="w-4 h-4 text-indigo-500 drop-shadow-sm" />;
      case 'ico':
        return <FileImage className="w-4 h-4 text-blue-500 drop-shadow-sm" />;
      default:
        return <File className="w-4 h-4 text-foreground/60 drop-shadow-sm" />;
    }
  };

  const toggleNode = (path: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedNodes(newExpanded);
  };

  const renderNode = (node: TreeNode, depth: number = 0): React.ReactElement => {
    const isExpanded = expandedNodes.has(node.path);
    const hasChildren = node.children && node.children.length > 0;
    const isHovered = hoveredNode === node.path;

    return (
      <div key={node.path} className="select-none">
        <div
          className={`flex items-center gap-1.5 py-1.5 px-2 cursor-pointer transition-all duration-300 group relative ${isHovered
              ? 'bg-gradient-to-r from-accent-yellow/15 to-accent-yellow/5 border border-accent-yellow/40 shadow-sm transform scale-[1.01]'
              :  node.path
              ? 'bg-white border border-orange-500/10'
              : 'hover:bg-gradient-to-r hover:from-foreground/8 hover:to-foreground/3 border border-transparent hover:border-foreground/20 hover:shadow-sm'
            }`}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={(e) => {
            if (hasChildren) {
              toggleNode(node.path);
            }
            
          }}
          onMouseEnter={() => setHoveredNode(node.path)}
          onMouseLeave={() => setHoveredNode(null)}
        >
          {/* Expand/Collapse Icon */}
          <div className="w-3 h-3 flex items-center justify-center flex-shrink-0">
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="w-3 h-3 text-foreground/70 group-hover:text-accent-yellow transition-all duration-200 transform group-hover:scale-110" />
              ) : (
                <ChevronRight className="w-3 h-3 text-foreground/70 group-hover:text-accent-yellow transition-all duration-200 transform group-hover:scale-110" />
              )
            ) : (
              <div className="w-3 h-3" />
            )}
          </div>

          {/* File/Folder Icon */}
          <div className="flex-shrink-0 transform transition-transform duration-200 group-hover:scale-110">
            {getFileIcon(node)}
          </div>

          {/* Name */}
          <span className={`text-xs font-medium truncate flex-1 transition-all duration-200 ${node.type === 'directory'
              ? 'text-foreground group-hover:text-accent-yellow group-hover:font-semibold'
              : 'text-foreground/90 group-hover:text-foreground group-hover:font-semibold'
            }`}>
            {node.name}
          </span>

          {/* File extension badge */}
          {node.type === 'file' && node.extension && (
            <span className="ml-1.5 text-xs text-foreground/60 bg-gradient-to-r from-foreground/10 to-foreground/5 px-1.5 py-0.5 font-mono flex-shrink-0 border border-foreground/10 group-hover:border-accent-yellow/30 group-hover:bg-gradient-to-r group-hover:from-accent-yellow/10 group-hover:to-accent-yellow/5 transition-all duration-200">
              .{node.extension}
            </span>
          )}
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="animate-in slide-in-from-top-2 duration-300 ease-out ml-1.5 border-l border-foreground/10 pl-1.5">
            {node.children!.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const tree = buildTree();
  const visibleFileCount = Math.min(files.length, 50);

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="relative bg-white border-2 border-gray-200 p-3 overflow-hidden shadow-[4px_4px_0px_0px_#e0e0e0] hover:shadow-[6px_6px_0px_0px_#e0e0e0] transition-all duration-200 hover:-translate-y-0.5">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <File className="w-4 h-4 text-gray-700" />
              <div className="text-xl font-bold font-black text-accent-yellow tracking-tight">{totalFiles}</div>
            </div>
            <div className="text-xs text-gray-600 font-semibold">Total Files</div>
          </div>
        </div>
        <div className="relative bg-white border-2 border-gray-200 p-3 overflow-hidden shadow-[4px_4px_0px_0px_#e0e0e0] hover:shadow-[6px_6px_0px_0px_#e0e0e0] transition-all duration-200 hover:-translate-y-0.5">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <Folder className="w-4 h-4 text-gray-700" />
              <div className="text-xl font-black font-bold text-gray-700 tracking-tight">{directories.length}</div>
            </div>
            <div className="text-xs text-gray-600 font-semibold">Directories</div>
          </div>
        </div>
      </div>

      {/* Tree View */}
      <div className="bg-gradient-to-br from-background/40 to-background/20  p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-accent-yellow" />
          <h4 className="text-base font-semibold text-foreground">Project Structure</h4>
        </div>

        <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent space-y-0.5">
          {tree.children && tree.children.length > 0 ? (
            tree.children.map(child => renderNode(child, 0))
          ) : (
            <div className="text-center py-6 text-foreground/50">
              <File className="w-6 h-6 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-medium">No files found</p>
              <p className="text-xs mt-0.5">The repository appears to be empty</p>
            </div>
          )}
        </div>

        {files.length > visibleFileCount && (
          <div className="mt-4 pt-3 border-t border-gray-700/30">
            <div className="bg-accent-yellow/10 border border-accent-yellow/30 rounded-lg p-3">
              <p className="text-sm text-foreground/80 text-center font-medium">
                Showing {visibleFileCount} of {files.length} files
              </p>
              <p className="text-xs text-foreground/60 text-center mt-1">
                Large repositories are limited for optimal performance
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}