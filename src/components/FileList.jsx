import React, { useEffect } from 'react';
import { useFileOperations } from '../hooks/useFileOperations';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function FileList() {
  const {
    currentDirectory,
    isLoading,
    error,
    loadDirectory
  } = useFileOperations();

  console.log('FileList.jsx currentDirectory', currentDirectory);

  // Load current directory contents when component mounts
  useEffect(() => {
    loadDirectory('/');
  }, [loadDirectory]);

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
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          {currentDirectory.path || '/'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1">
          {currentDirectory.contents?.map((item) => (
            <li
              key={item.path}
              onClick={() => item.type === 'directory' && loadDirectory(item.path)}
              className={`
                flex items-center px-2 py-1.5 rounded-md
                text-sm
                hover:bg-accent hover:text-accent-foreground
                cursor-pointer
                ${item.type === 'directory' ? 'text-primary' : 'text-muted-foreground'}
              `}
            >
              <span className="icon mr-2 opacity-70">
                {item.type === 'directory' ? '📁' : '📄'}
              </span>
              <span className="flex-1 truncate">{item.name}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}