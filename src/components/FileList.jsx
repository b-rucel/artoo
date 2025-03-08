import React, { useState, useRef } from 'react';
import { useFileOperations } from '../hooks/useFileOperations';
import { fileService } from '../services/fileService';

import { FileIcon, FolderIcon, Trash2Icon, CopyIcon, MoveIcon, DownloadIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// File context menu component
function FileContextMenu({ file, isOpen, onOpenChange, position, onAction }) {
  return (
    <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger className="hidden">Open</DropdownMenuTrigger>
      <DropdownMenuContent
        style={{
          position: 'absolute',
          left: `${position.x}px`,
          top: `${position.y}px`
        }}
      >
        <DropdownMenuItem className="cursor-pointer flex items-center" onClick={() => onAction('download', file)}>
          <DownloadIcon className="mr-2 h-4 w-4" />
          <span>Download</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer flex items-center" onClick={() => onAction('copy', file)}>
          <CopyIcon className="mr-2 h-4 w-4" />
          <span>Copy to...</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer flex items-center" onClick={() => onAction('move', file)}>
          <MoveIcon className="mr-2 h-4 w-4" />
          <span>Move to...</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer flex items-center text-destructive" onClick={() => onAction('delete', file)}>
          <Trash2Icon className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Directory context menu component
function DirectoryContextMenu({ directory, isOpen, onOpenChange, position, onAction }) {
  return (
    <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger className="hidden">Open</DropdownMenuTrigger>
      <DropdownMenuContent
        style={{
          position: 'absolute',
          left: `${position.x}px`,
          top: `${position.y}px`
        }}
      >
        <DropdownMenuItem className="cursor-pointer flex items-center" onClick={() => onAction('copy', directory)}>
          <CopyIcon className="mr-2 h-4 w-4" />
          <span>Copy to...</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer flex items-center" onClick={() => onAction('move', directory)}>
          <MoveIcon className="mr-2 h-4 w-4" />
          <span>Move to...</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer flex items-center text-destructive" onClick={() => onAction('delete', directory)}>
          <Trash2Icon className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Parent directory component
function ParentDirectoryItem({ currentPath, onNavigate, viewMode }) {
  if (currentPath === '/') return null;

  const handleClick = () => {
    const parentPath = currentPath.split('/').slice(0, -1).join('/') || '/';
    onNavigate(parentPath);
  };

  if (viewMode === 'grid') {
    return (
      <div
        onClick={handleClick}
        className={`
          aspect-square group p-4 rounded cursor-pointer transition-colors flex flex-col items-center justify-center
          hover:bg-accent hover:text-accent-foreground border border-transparent hover:border-border
        `}
      >
        <FolderIcon className="h-12 w-12 text-primary opacity-80 group-hover:opacity-100 mb-3" />
        <span className="text-sm font-medium truncate w-full text-center">../</span>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`
        group flex items-center p-3 rounded hover:bg-accent hover:text-accent-foreground cursor-pointer
        transition-colors border border-transparent hover:border-border
      `}
    >
      <FolderIcon className="h-5 w-5 text-primary opacity-80 group-hover:opacity-100 mr-3" />
      <span className="flex-1 font-medium">../</span>
    </div>
  );
}

// Directory item component
function DirectoryItem({ dir, currentPath, onNavigate, viewMode, handleContextMenu, isAuthenticated, contextMenuDir, setContextMenuDir, menuPosition, onDirectoryAction }) {
  const handleClick = () => onNavigate(`${currentPath === '/' ? '' : currentPath}/${dir.name}`);

  if (viewMode === 'grid') {
    return (
      <div
        onClick={handleClick}
        onContextMenu={(e) => handleContextMenu(e, dir)}
        className={`
          aspect-square group p-4 rounded cursor-pointer transition-colors flex flex-col items-center justify-center
          hover:bg-accent hover:text-accent-foreground border border-transparent hover:border-border
        `}
      >
        <FolderIcon className="h-12 w-12 text-primary opacity-80 group-hover:opacity-100 mb-3" />
        <span className="text-sm font-medium truncate w-full text-center">{dir.name}</span>
        <span className="text-xs text-muted-foreground mt-1">Directory</span>
        {isAuthenticated && contextMenuDir?.name === dir.name && (
          <DirectoryContextMenu
            directory={dir}
            isOpen={true}
            onOpenChange={() => setContextMenuDir(null)}
            position={menuPosition}
            onAction={onDirectoryAction}
          />
        )}
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      onContextMenu={(e) => handleContextMenu(e, dir)}
      className={`
        group flex items-center p-3 rounded hover:bg-accent hover:text-accent-foreground cursor-pointer
        transition-colors border border-transparent hover:border-border
      `}
    >
      <FolderIcon className="h-5 w-5 text-primary opacity-80 group-hover:opacity-100 mr-3" />
      <span className="flex-1 font-medium">{dir.name}</span>
      <span className="text-sm text-muted-foreground">Directory</span>
      {isAuthenticated && contextMenuDir?.name === dir.name && (
        <DirectoryContextMenu
          directory={dir}
          isOpen={true}
          onOpenChange={() => setContextMenuDir(null)}
          position={menuPosition}
          onAction={onDirectoryAction}
        />
      )}
    </div>
  );
}

// File item component
function FileItem({ file, selectedFilePath, onFileSelect, handleContextMenu, isAuthenticated, contextMenuFile, setContextMenuFile, viewMode, menuPosition, onFileAction }) {
  if (viewMode === 'grid') {
    return (
      <div
        key={file.name}
        onClick={() => onFileSelect(file)}
        onContextMenu={(e) => handleContextMenu(e, file)}
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
        {isAuthenticated && contextMenuFile?.name === file.name && (
          <FileContextMenu
            file={file}
            isOpen={true}
            onOpenChange={() => setContextMenuFile(null)}
            position={menuPosition}
            onAction={onFileAction}
          />
        )}
      </div>
    );
  }

  return (
    <div
      key={file.name}
      onClick={() => onFileSelect(file)}
      onContextMenu={(e) => handleContextMenu(e, file)}
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
      {isAuthenticated && contextMenuFile?.name === file.name && (
        <FileContextMenu
          file={file}
          isOpen={true}
          onOpenChange={() => setContextMenuFile(null)}
          position={menuPosition}
          onAction={onFileAction}
        />
      )}
    </div>
  );
}

export function FileList({ onFileSelect, viewMode, selectedFilePath, currentPath, onNavigate }) {
  const { isAuthenticated } = useAuth();
  const [contextMenuFile, setContextMenuFile] = useState(null);
  const [contextMenuDir, setContextMenuDir] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const {
    currentDirectory,
    isLoading,
    error,
    downloadFile,
    deleteFile,
    moveFile,
    copyFile,
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

  const handleFileContextMenu = (e, file) => {
    if (!isAuthenticated) return;
    e.preventDefault();
    setContextMenuFile(file);
    setContextMenuDir(null);
    setMenuPosition({ x: e.clientX, y: e.clientY });
  };

  const handleDirContextMenu = (e, dir) => {
    if (!isAuthenticated) return;
    e.preventDefault();
    setContextMenuDir(dir);
    setContextMenuFile(null);
    setMenuPosition({ x: e.clientX, y: e.clientY });
  };

  // Handle file actions
  const handleFileAction = async (action, file) => {
    setContextMenuFile(null);

    switch (action) {
      case 'download':
        try {
          await downloadFile(file.name);
        } catch (error) {
          console.error('Error downloading file:', error);
        }
        break;

      case 'copy':
        try {
          const destination = prompt('Enter destination path:', file.name);
          if (destination && destination !== file.name) {
            await copyFile(file, destination);
          }
        } catch (error) {
          console.error('Error copying file:', error);
        }
        break;

      case 'move':
        try {
          const destination = prompt('Enter destination path:', file.name);
          if (destination && destination !== file.name) {
            await moveFile(file, destination);
          }
        } catch (error) {
          console.error('Error moving file:', error);
        }
        break;

      case 'delete':
        try {
          if (window.confirm(`Are you sure you want to delete ${file.name}?`)) {
            await deleteFile(file);
          }
        } catch (error) {
          console.error('Error deleting file:', error);
        }
        break;

      default:
        console.log('Unknown action:', action);
    }
  };


  // Handle directory actions
  const handleDirectoryAction = async (action, directory) => {
    setContextMenuDir(null); // Close the menu

    switch (action) {
      case 'copy':
        // Implement copy functionality
        console.log('Copy directory:', directory);
        // You might want to open a modal to select destination
        break;

      case 'move':
        // Implement move functionality
        console.log('Move directory:', directory);
        // You might want to open a modal to select destination
        break;

      case 'delete':
        try {
          if (window.confirm(`Are you sure you want to delete ${directory.name} and all its contents?`)) {
            // await deleteDirectory(directory);
          }
        } catch (error) {
          console.error('Error deleting directory:', error);
          // You might want to show a toast notification here
        }
        break;

      default:
        console.log('Unknown action:', action);
    }
  };

  return (
    <div className="h-full p-4 overflow-y-auto">
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <ParentDirectoryItem currentPath={currentPath} onNavigate={onNavigate} viewMode="grid" />

          {directories.map((dir, i) => (
            <DirectoryItem
              key={i}
              dir={dir}
              currentPath={currentPath}
              onNavigate={onNavigate}
              viewMode="grid"
              handleContextMenu={handleDirContextMenu}
              isAuthenticated={isAuthenticated}
              contextMenuDir={contextMenuDir}
              setContextMenuDir={setContextMenuDir}
              menuPosition={menuPosition}
              onDirectoryAction={handleDirectoryAction}
            />
          ))}

          {files.map(file => (
            <FileItem
              key={file.name}
              file={file}
              selectedFilePath={selectedFilePath}
              onFileSelect={onFileSelect}
              handleContextMenu={handleFileContextMenu}
              isAuthenticated={isAuthenticated}
              contextMenuFile={contextMenuFile}
              setContextMenuFile={setContextMenuFile}
              viewMode="grid"
              menuPosition={menuPosition}
              onFileAction={handleFileAction}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          <ParentDirectoryItem currentPath={currentPath} onNavigate={onNavigate} viewMode="list" />

          {directories.map((dir, i) => (
            <DirectoryItem
              key={i}
              dir={dir}
              currentPath={currentPath}
              onNavigate={onNavigate}
              viewMode="list"
              handleContextMenu={handleDirContextMenu}
              isAuthenticated={isAuthenticated}
              contextMenuDir={contextMenuDir}
              setContextMenuDir={setContextMenuDir}
              menuPosition={menuPosition}
              onDirectoryAction={handleDirectoryAction}
            />
          ))}

          {files.map(file => (
            <FileItem
              key={file.name}
              file={file}
              selectedFilePath={selectedFilePath}
              onFileSelect={onFileSelect}
              handleContextMenu={handleFileContextMenu}
              isAuthenticated={isAuthenticated}
              contextMenuFile={contextMenuFile}
              setContextMenuFile={setContextMenuFile}
              viewMode="list"
              menuPosition={menuPosition}
              onFileAction={handleFileAction}
            />
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
