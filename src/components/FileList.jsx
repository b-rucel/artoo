import React from 'react';
import { useFileOperations } from '../hooks/useFileOperations';
import { FileIcon, FolderIcon } from 'lucide-react';

export function FileList({ onFileSelect, viewMode, selectedFilePath, currentPath, onNavigate }) {
  const {
    currentDirectory,
    isLoading,
    error,
    loadDirectory
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

  const getDirectoryContents = (files) => {
    const contents = {
      files: [],
      directories: new Set()
    };

    if (!files) return contents;

    files.forEach(file => {
      const relativePath = file.name.startsWith('/') ? file.name.slice(1) : file.name;

      if (currentPath === '/') {
        if (!relativePath.includes('/')) {
          contents.files.push(file);
        } else {
          contents.directories.add(relativePath.split('/')[0]);
        }
      } else {
        const pathPrefix = currentPath.slice(1) + '/';
        if (relativePath.startsWith(pathPrefix)) {
          const remainingPath = relativePath.slice(pathPrefix.length);
          if (!remainingPath.includes('/')) {
            contents.files.push(file);
          } else {
            contents.directories.add(remainingPath.split('/')[0]);
          }
        }
      }
    });

    return contents;
  };

  const { files, directories } = getDirectoryContents(currentDirectory.contents);

  return (
    <div className="space-y-4">
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {currentPath !== '/' && (
            <div
              onClick={() => {
                const parentPath = currentPath.split('/').slice(0, -1).join('/') || '/';
                onNavigate(parentPath);
              }}
              className={`
                aspect-square
                group
                flex flex-col items-center justify-center
                p-4
                rounded
                hover:bg-accent hover:text-accent-foreground
                cursor-pointer
                transition-colors
                border
                border-transparent
                hover:border-border
              `}
            >
              <FolderIcon className="h-12 w-12 text-primary opacity-80 group-hover:opacity-100 mb-3" />
              <span className="text-sm font-medium truncate w-full text-center">../</span>
            </div>
          )}

          {Array.from(directories).map(dir => (
            <div
              key={dir}
              onClick={() => onNavigate(`${currentPath === '/' ? '' : currentPath}/${dir}`)}
              className={`
                aspect-square
                group
                flex flex-col items-center justify-center
                p-4
                rounded
                hover:bg-accent hover:text-accent-foreground
                cursor-pointer
                transition-colors
                border
                border-transparent
                hover:border-border
              `}
            >
              <FolderIcon className="h-12 w-12 text-primary opacity-80 group-hover:opacity-100 mb-3" />
              <span className="text-sm font-medium truncate w-full text-center">{dir}</span>
              <span className="text-xs text-muted-foreground mt-1">Directory</span>
            </div>
          ))}

          {files.map(file => (
            <div
              key={file.name}
              onClick={() => onFileSelect(file)}
              className={`
                aspect-square
                group
                flex flex-col items-center justify-center
                p-4
                rounded
                hover:bg-accent hover:text-accent-foreground
                cursor-pointer
                transition-colors
                border
                ${file.name === selectedFilePath
                  ? 'border-primary bg-accent'
                  : 'border-transparent'}
                hover:border-border
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
                group
                flex items-center
                p-3
                rounded
                hover:bg-accent hover:text-accent-foreground
                cursor-pointer
                transition-colors
                border
                border-transparent
                hover:border-border
              `}
            >
              <FolderIcon className="h-5 w-5 text-primary opacity-80 group-hover:opacity-100 mr-3" />
              <span className="flex-1 font-medium">../</span>
            </div>
          )}

          {Array.from(directories).map(dir => (
            <div
              key={dir}
              onClick={() => onNavigate(`${currentPath === '/' ? '' : currentPath}/${dir}`)}
              className={`
                group
                flex items-center
                p-3
                rounded
                hover:bg-accent hover:text-accent-foreground
                cursor-pointer
                transition-colors
                border
                border-transparent
                hover:border-border
              `}
            >
              <FolderIcon className="h-5 w-5 text-primary opacity-80 group-hover:opacity-100 mr-3" />
              <span className="flex-1 font-medium">{dir}</span>
              <span className="text-sm text-muted-foreground">Directory</span>
            </div>
          ))}

          {files.map(file => (
            <div
              key={file.name}
              onClick={() => onFileSelect(file)}
              className={`
                group
                flex items-center
                p-3
                rounded
                hover:bg-accent hover:text-accent-foreground
                cursor-pointer
                transition-colors
                border
                ${file.name === selectedFilePath
                  ? 'border-primary bg-accent'
                  : 'border-transparent'}
                hover:border-border
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
