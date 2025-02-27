import React, { useEffect, useState } from 'react';
import { useFileOperations } from '../hooks/useFileOperations';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronRight, ChevronDown } from 'lucide-react';

export function FolderTree({ currentPath, onNavigate }) {
  const {
    folderStructure,
    isLoading,
    error,
    loadDirectory
  } = useFileOperations();

  // Track expanded directories
  const [expandedDirs, setExpandedDirs] = useState(new Set(['/']));

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

  // Update the tree rendering section
  const handleDirectoryClick = (path) => {
    loadDirectory(path);
    onNavigate?.(); // Close panel on mobile
  };

  const renderDirectory = (item) => {
    const isExpanded = expandedDirs.has(item.path);
    const isSelected = currentPath === item.path;

    return (
      <li key={item.path}>
        <div
          onClick={() => handleDirectoryClick(item.path)}
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
        {isExpanded && item.children && (
          <ul className="pl-4 space-y-1 mt-1">
            {item.children
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(child => renderDirectory(child))}
          </ul>
        )}
      </li>
    );
  };

  if (isLoading) return (
    <Card className="h-full rounded-none border-t-0">
      <CardContent className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading...</div>
      </CardContent>
    </Card>
  );

  if (error) return (
    <Card className="h-full rounded-none border-t-0">
      <CardContent className="flex items-center justify-center h-full">
        <div className="text-destructive">Error: {error}</div>
      </CardContent>
    </Card>
  );

  return (
    <Card className="h-full min-w-[200px] rounded-none border-t-0">
      <CardHeader className="px-6 py-2">
        <CardTitle className="text-sm font-medium">
          files
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-45px)] overflow-y-auto">
        <ul className="space-y-1">
          {folderStructure && folderStructure.length > 0 && renderDirectory(folderStructure[0])}
        </ul>
      </CardContent>
    </Card>
  );
}