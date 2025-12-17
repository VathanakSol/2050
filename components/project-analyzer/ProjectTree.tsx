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
  GitBranch
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
      return expandedNodes.has(node.path) ? 
        <FolderOpen className="w-3.5 h-3.5 text-blue-400" /> : 
        <Folder className="w-3.5 h-3.5 text-blue-500" />;
    }

    const ext = node.extension || '';
    const name = node.name.toLowerCase();

    // Special files
    if (name === 'package.json' || name === 'package-lock.json') {
      return <Package className="w-3.5 h-3.5 text-green-500" />;
    }
    if (name === '.gitignore' || name === '.gitattributes') {
      return <GitBranch className="w-3.5 h-3.5 text-orange-500" />;
    }
    if (name.includes('config') || name.includes('settings')) {
      return <Settings className="w-3.5 h-3.5 text-gray-500" />;
    }

    // By extension
    switch (ext) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
      case 'vue':
      case 'py':
      case 'java':
      case 'cpp':
      case 'c':
      case 'cs':
      case 'php':
      case 'rb':
      case 'go':
      case 'rs':
        return <FileCode className="w-3.5 h-3.5 text-accent-yellow" />;
      case 'md':
      case 'txt':
      case 'doc':
      case 'docx':
        return <FileText className="w-3.5 h-3.5 text-blue-400" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
      case 'webp':
        return <FileImage className="w-3.5 h-3.5 text-purple-500" />;
      default:
        return <File className="w-3.5 h-3.5 text-foreground/60" />;
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
          className={`flex items-center gap-1.5 py-1.5 px-2 rounded-md cursor-pointer transition-all duration-200 group ${
            isHovered 
              ? 'bg-accent-yellow/10 border border-accent-yellow/30' 
              : 'hover:bg-foreground/5 border border-transparent hover:border-foreground/10'
          }`}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => hasChildren && toggleNode(node.path)}
          onMouseEnter={() => setHoveredNode(node.path)}
          onMouseLeave={() => setHoveredNode(null)}
        >
          {/* Expand/Collapse Icon */}
          <div className="w-3 h-3 flex items-center justify-center flex-shrink-0">
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="w-3 h-3 text-foreground/70 group-hover:text-foreground transition-colors" />
              ) : (
                <ChevronRight className="w-3 h-3 text-foreground/70 group-hover:text-foreground transition-colors" />
              )
            ) : (
              <div className="w-3 h-3" />
            )}
          </div>

          {/* File/Folder Icon */}
          <div className="flex-shrink-0">
            {getFileIcon(node)}
          </div>

          {/* Name */}
          <span className={`text-xs font-medium truncate flex-1 ${
            node.type === 'directory' 
              ? 'text-foreground group-hover:text-accent-yellow transition-colors' 
              : 'text-foreground/85 group-hover:text-foreground transition-colors'
          }`}>
            {node.name}
          </span>

          {/* File extension badge */}
          {node.type === 'file' && node.extension && (
            <span className="ml-1 text-xs text-foreground/50 bg-foreground/8 px-1.5 py-0.5 rounded font-mono flex-shrink-0">
              .{node.extension}
            </span>
          )}
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="animate-in slide-in-from-top-1 duration-200 ease-out">
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
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-background/50 rounded-md p-2 border border-gray-700/50">
          <div className="text-lg font-bold text-foreground">{totalFiles}</div>
          <div className="text-xs text-foreground/60">Total Files</div>
        </div>
        <div className="bg-background/50 rounded-md p-2 border border-gray-700/50">
          <div className="text-lg font-bold text-foreground">{directories.length}</div>
          <div className="text-xs text-foreground/60">Directories</div>
        </div>
      </div>

      {/* Tree View */}
      <div className="bg-background/30 rounded-md border border-gray-700/50 p-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-foreground">Project Structure</h4>
          
        </div>
        
        <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {tree.children && tree.children.length > 0 ? (
            tree.children.map(child => renderNode(child, 0))
          ) : (
            <div className="text-center py-6 text-foreground/50">
              <File className="w-6 h-6 mx-auto mb-2" />
              <p className="text-xs">No files found</p>
            </div>
          )}
        </div>

        {files.length > visibleFileCount && (
          <div className="mt-2 pt-2 border-t border-gray-700/50">
            <p className="text-xs text-foreground/60 text-center">
              Showing {visibleFileCount} of {files.length} files
              <span className="block text-xs mt-0.5">
                Large repositories are limited for performance
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}