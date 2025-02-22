import React from 'react';
import { useFileOperations } from '../hooks/useFileOperations';
import { FileIcon, FolderIcon } from 'lucide-react';

export function FileList() {
  const {
    currentDirectory,
    isLoading,
    error,
    loadDirectory
  } = useFileOperations();

  // console.log('FileList.jsx currentDirectory', currentDirectory);

if (isLoading) return (
    <div className="flex items-center justify-center h-32">
      <div className="text-muted-foreground">Loading...</div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-32">
      <div className="text-destructive">Error: {error}</div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {currentDirectory.contents?.map((item) => (
        <div
          key={item.path}
          onClick={() => item.type === 'directory' && loadDirectory(item.path)}
          className={`
            aspect-square
            group
            flex flex-col items-center justify-center
            p-4
            rounded-lg
            hover:bg-accent hover:text-accent-foreground
            cursor-pointer
            transition-colors
            border border-transparent
            hover:border-border
          `}
        >
          {/* {console.log('FileList.jsx item', item)} */}
          {item.type === 'directory' ? (
            <FolderIcon className="h-12 w-12 text-primary opacity-80 group-hover:opacity-100 mb-3" />
          ) : (
            <FileIcon className="h-12 w-12 text-muted-foreground opacity-80 group-hover:opacity-100 mb-3" />
          )}
          <span className="text-sm font-medium truncate w-full text-center">
            {item.name}
          </span>
          <span className="text-xs text-muted-foreground mt-1">
            {item.type === 'directory' ? `${item.contents?.length || 0} items` : formatFileSize(item.size)}
          </span>
        </div>
      ))}
    </div>
  );
}

function formatFileSize(bytes) {
  if (!bytes) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}
