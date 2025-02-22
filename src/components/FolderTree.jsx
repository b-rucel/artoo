import React, { useEffect } from 'react';
import { useFileOperations } from '../hooks/useFileOperations';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function FolderTree() {
  const {
    currentDirectory,
    isLoading,
    error,
    loadDirectory
  } = useFileOperations();

  // console.log('FileList.jsx currentDirectory', currentDirectory);

  // Transform flat file list into directory structure
  const buildDirectoryTree = (files) => {
    const root = { path: '/', name: '/', type: 'directory', contents: [] };
    const pathMap = { '/': root };

    files.forEach(file => {
      const parts = file.name.split('/');
      const fileName = parts.pop();
      let currentPath = '';

      // Create/update directory entries
      parts.forEach(part => {
        const parentPath = currentPath;
        currentPath = currentPath ? `${currentPath}/${part}` : part;

        if (!pathMap[currentPath]) {
          const dirEntry = {
            path: currentPath,
            name: part,
            type: 'directory',
            contents: []
          };
          pathMap[currentPath] = dirEntry;
          pathMap[parentPath || '/'].contents.push(dirEntry);
        }
      });

      // Add file entry
      const fileEntry = {
        path: file.name,
        name: fileName,
        type: 'file',
        size: file.size,
        uploaded: file.uploaded
      };
      pathMap[currentPath || '/'].contents.push(fileEntry);
    });

    return root;
  };

  // Load current directory contents when component mounts
  useEffect(() => {
    loadDirectory('/');
  }, [loadDirectory]);

  // Build the tree from the current directory's contents
  const directoryTree = currentDirectory?.contents ? buildDirectoryTree(currentDirectory.contents) : null;

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
    <Card className="min-w-[200px]">
      <CardHeader className="px-6 py-2">
        <CardTitle className="text-sm font-medium">
          {currentDirectory?.path || '/'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1">
          {directoryTree?.contents
            .filter(item => item.type === 'directory')
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((item) => (
            <li
              key={item.path}
              onClick={() => loadDirectory(item.path)}
              className={`
                flex items-center px-2 py-1.5 rounded
                text-sm
                hover:bg-accent hover:text-accent-foreground
                cursor-pointer
                text-primary
              `}
            >
              <span className="icon mr-2 opacity-70">
                📁
              </span>
              <span className="flex-1 truncate">
                {item.name}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}