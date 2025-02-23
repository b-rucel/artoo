import React, { useEffect, useState } from 'react';
import { useFileOperations } from '../hooks/useFileOperations';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronRight, ChevronDown } from 'lucide-react';

export function FolderTree({ currentPath }) {
  const {
    currentDirectory,
    isLoading,
    error,
    loadDirectory
  } = useFileOperations();

  // Track expanded directories
  const [expandedDirs, setExpandedDirs] = useState(new Set(['/']));

  // Load root directory on mount
  useEffect(() => {
    loadDirectory('/');
  }, [loadDirectory]);

  // Automatically expand parent directories when currentPath changes
  useEffect(() => {
    if (currentPath === '/') return;

    // Split the path and create all parent paths
    const parts = currentPath.split('/').filter(Boolean);
    const paths = parts.reduce((acc, part, index) => {
      const path = '/' + parts.slice(0, index + 1).join('/');
      acc.add(path);
      return acc;
    }, new Set(['/']));

    // Expand all parent directories
    setExpandedDirs(prev => {
      const next = new Set(prev);
      paths.forEach(path => next.add(path));
      return next;
    });

    // Load each parent directory to ensure we have the full structure
    paths.forEach(path => {
      loadDirectory(path);
    });
  }, [currentPath, loadDirectory]);

  // Toggle directory expansion
  const toggleDirectory = (path, e) => {
    e.stopPropagation();
    setExpandedDirs(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  // Transform flat file list into directory structure
  const buildDirectoryTree = (files) => {
    const root = { path: '/', name: '/', type: 'directory', contents: [] };
    const pathMap = { '/': root };

    files.forEach(file => {
      // Remove leading slash if present
      const normalizedName = file.name.startsWith('/') ? file.name.slice(1) : file.name;
      const parts = normalizedName.split('/');

      // Build each directory in the path
      let currentPath = '';
      parts.forEach((part, index) => {
        const isLastPart = index === parts.length - 1;
        const parentPath = currentPath;
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        const fullPath = '/' + currentPath;

        if (!isLastPart) {
          if (!pathMap[fullPath]) {
            const dirEntry = {
              path: fullPath,
              name: part,
              type: 'directory',
              contents: []
            };
            pathMap[fullPath] = dirEntry;

            // Add to parent's contents
            const parentFullPath = parentPath ? '/' + parentPath : '/';
            pathMap[parentFullPath].contents.push(dirEntry);
          }
        } else if (file.type !== 'directory') {
          // Add file to its parent directory
          const parentFullPath = parentPath ? '/' + parentPath : '/';
          pathMap[parentFullPath].contents.push({
            path: '/' + currentPath,
            name: part,
            type: 'file',
            size: file.size,
            uploaded: file.uploaded
          });
        }
      });
    });

    return root;
  };

  // Build the tree from the current directory's contents
  const directoryTree = currentDirectory?.contents ? buildDirectoryTree(currentDirectory.contents) : null;

  const renderDirectory = (item) => {
    const isExpanded = expandedDirs.has(item.path);
    const isSelected = currentPath === item.path;

    return (
      <li key={item.path}>
        <div
          onClick={() => loadDirectory(item.path)}
          className={`
            flex items-center px-2 py-1.5 rounded
            text-sm
            hover:bg-accent hover:text-accent-foreground
            cursor-pointer
            ${isSelected ? 'bg-accent text-accent-foreground' : 'text-primary'}
          `}
        >
          <button
            onClick={(e) => toggleDirectory(item.path, e)}
            className="p-1 hover:bg-accent rounded-sm mr-1"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          <span className="icon mr-2 opacity-70">
            📁
          </span>
          <span className="flex-1 truncate">
            {item.name}
          </span>
        </div>
        {isExpanded && item.contents && (
          <ul className="pl-4 space-y-1 mt-1">
            {item.contents
              .filter(child => child.type === 'directory')
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(child => renderDirectory(child))}
          </ul>
        )}
      </li>
    );
  };

  if (isLoading) return (
    <Card>
      <CardContent className="flex items-center justify-center h-32">
        <div className="text-muted-foreground">Loading...</div>
      </CardContent>
    </Card>
  );

  if (error) return (
    <Card>
      <CardContent className="flex items-center justify-center h-32">
        <div className="text-destructive">Error: {error}</div>
      </CardContent>
    </Card>
  );

  return (
    <Card className="min-w-[200px] rounded-none border-t-0">
      <CardHeader className="px-6 py-2">
        <CardTitle className="text-sm font-medium">
          Files
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1">
          {directoryTree && renderDirectory(directoryTree)}
        </ul>
      </CardContent>
    </Card>
  );
}