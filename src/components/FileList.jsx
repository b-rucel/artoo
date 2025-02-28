import React from 'react';
import { useFileOperations } from '../hooks/useFileOperations';
import { FileIcon, FolderIcon } from 'lucide-react';

export function FileList({ onFileSelect, viewMode, selectedFilePath, currentPath, onNavigate }) {
  const {
    currentDirectory,
    isLoading,
    error,
  } = useFileOperations();

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

  const {files, directories} = currentDirectory;

  return (
    <div className="h-full p-4 overflow-y-auto">
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {currentPath !== '/' && (
            <div
              onClick={() => {
                const parentPath = currentPath.split('/').slice(0, -1).join('/') || '/';
                onNavigate(parentPath);
              }}
              className={`
                aspect-square group p-4 rounded cursor-pointer transition-colors flex flex-col items-center justify-center
                hover:bg-accent hover:text-accent-foreground border border-transparent hover:border-border
              `}
            >
              <FolderIcon className="h-12 w-12 text-primary opacity-80 group-hover:opacity-100 mb-3" />
              <span className="text-sm font-medium truncate w-full text-center">../</span>
            </div>
          )}

          {directories.map((dir, i) => (
            <div
              key={i}
              onClick={() => onNavigate(`${currentPath === '/' ? '' : currentPath}/${dir.name}`)}
              className={`
                aspect-square group p-4 rounded cursor-pointer transition-colors flex flex-col items-center justify-center
                hover:bg-accent hover:text-accent-foreground border border-transparent hover:border-border
              `}
            >
              <FolderIcon className="h-12 w-12 text-primary opacity-80 group-hover:opacity-100 mb-3" />
              <span className="text-sm font-medium truncate w-full text-center">{dir.name}</span>
              <span className="text-xs text-muted-foreground mt-1">Directory</span>
            </div>
          ))}

          {files.map(file => (
            <div
              key={file.name}
              onClick={() => onFileSelect(file)}
              className={`
                aspect-square group p-4 rounded cursor-pointer transition-colors flex flex-col items-center justify-center
                hover:bg-accent hover:text-accent-foreground border border-transparent hover:border-border
                ${file.name === selectedFilePath
                  ? 'border-primary bg-accent'
                  : 'border-transparent'}
              `}
            >
              <FileIcon className="h-12 w-12 text-muted-foreground opacity-80 group-hover:opacity-100 mb-3" />
              <span className="text-sm font-medium truncate w-full text-center">
                {file.name.split('/').pop()}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                {formatFileSize(file.size)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {currentPath !== '/' && (
            <div
              onClick={() => {
                const parentPath = currentPath.split('/').slice(0, -1).join('/') || '/';
                onNavigate(parentPath);
              }}
              className={`
                group flex items-center p-3 rounded hover:bg-accent hover:text-accent-foreground cursor-pointer
                transition-colors border border-transparent hover:border-border
              `}
            >
              <FolderIcon className="h-5 w-5 text-primary opacity-80 group-hover:opacity-100 mr-3" />
              <span className="flex-1 font-medium">../</span>
            </div>
          )}

          {directories.map((dir, i) => (
            <div
              key={i}
              onClick={() => onNavigate(`${currentPath === '/' ? '' : currentPath}/${dir.name}`)}
              className={`
                group flex items-center p-3 rounded hover:bg-accent hover:text-accent-foreground cursor-pointer
                transition-colors border border-transparent hover:border-border
              `}
            >
              <FolderIcon className="h-5 w-5 text-primary opacity-80 group-hover:opacity-100 mr-3" />
              <span className="flex-1 font-medium">{dir.name}</span>
              <span className="text-sm text-muted-foreground">Directory</span>
            </div>
          ))}

          {files.map(file => (
            <div
              key={file.name}
              onClick={() => onFileSelect(file)}
              className={`
                group flex items-center p-3 rounded hover:bg-accent hover:text-accent-foreground cursor-pointer
                transition-colors border border-transparent hover:border-border
                ${file.name === selectedFilePath
                  ? 'border-primary bg-accent'
                  : 'border-transparent'}
              `}
            >
              <FileIcon className="h-5 w-5 text-muted-foreground opacity-80 group-hover:opacity-100 mr-3" />
              <span className="flex-1 font-medium">{file.name.split('/').pop()}</span>
              <span className="text-sm text-muted-foreground">
                {formatFileSize(file.size)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatFileSize(bytes) {
  if (!bytes) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}
