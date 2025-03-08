import { useCallback } from 'react';
import { useFileSystem } from '../context/FileSystemContext.jsx';
import { fileService } from '../services/fileService.js';

export function useFileOperations() {
  const { state, dispatch } = useFileSystem();

  const loadDirectory = useCallback(async (path) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const { directories, files } = await fileService.getDirectoryContents(path);

      dispatch({ type: 'SET_CURRENT_DIRECTORY',
        payload: {
          path,
          directories,
          files
        }
      });
    } catch (err) {
      dispatch({ type: 'SET_ERROR',
        payload: err instanceof Error ? err.message : 'Failed to load directory'
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch]);


  const uploadFiles = useCallback(async (uploadedFiles) => {
    const operationId = crypto.randomUUID();
    try {
      dispatch({
        type: 'SET_OPERATION',
        payload: {
          id: operationId,
          operation: { type: 'upload', status: 'pending' }
        }
      });

      // Upload each file and update Trie
      for (const file of uploadedFiles) {
        const path = state.currentDirectory.path === '/'
          ? file.name
          : `${state.currentDirectory.path}/${file.name}`;

        const result = await fileService.uploadFile(file, path);
        const normalizedPath = path === '/' ? '' : path.startsWith('/') ? path.slice(1) : path;

        // update trie with the new file
        fileService.insertFile(path, {
          name: normalizedPath,
          size: file.size,
          uploaded: new Date().toISOString(),
          etag: result.etag,
        });
      }

      // get directory contents
      const { directories, files } = fileService.getDirectoryContents(state.currentDirectory.path);
      dispatch({
        type: 'SET_CURRENT_DIRECTORY',
        payload: {
          path: state.currentDirectory.path,
          directories,
          files
        }
      });

      // refresh data
      loadDirectory(state.currentDirectory.path);

      dispatch({
        type: 'SET_OPERATION',
        payload: {
          id: operationId,
          operation: { type: 'upload', status: 'complete' }
        }
      });
    } catch (err) {
      dispatch({
        type: 'SET_OPERATION',
        payload: {
          id: operationId,
          operation: {
            type: 'upload',
            status: 'error',
            error: err instanceof Error ? err.message : 'Upload failed'
          }
        }
      });
    }
  }, [dispatch, state.currentDirectory, loadDirectory]);


  const downloadFile = async (fileName) => {
    try {
      const response = await fetch(`${fileService.baseUrl}/download/${fileName}`);

      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName.split('/').pop();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      throw new Error(`Failed to download file: ${error.message}`);
    }
  };


  const deleteFile = useCallback(async (file) => {
    try {
      await fileService.deleteFile(file);

      dispatch({
        type: 'SET_CURRENT_DIRECTORY',
        payload: {
          path: state.currentDirectory.path,
          directories: state.currentDirectory.directories,
          files: state.currentDirectory.files.filter(f => f.name !== file.name)
        }
      });
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  });


  const moveFile = useCallback(async (file, destination) => {
    try {
      await fileService.moveFile(file, destination);

      // Refresh the current directory
      loadDirectory(state.currentDirectory.path);
    } catch (error) {
      throw new Error(`Failed to move file: ${error.message}`);
    }
  }, [state.currentDirectory.path, loadDirectory]);


  const copyFile = useCallback(async (file, destination) => {
    try {
      await fileService.copyFile(file, destination);

      // Refresh the current directory
      loadDirectory(state.currentDirectory.path);
    } catch (error) {
      throw new Error(`Failed to copy file: ${error.message}`);
    }
  }, [state.currentDirectory.path, loadDirectory]);


  return {
    currentDirectory: state.currentDirectory,
    folderStructure: state.folderStructure,
    selectedFiles: state.selectedFiles,
    isLoading: state.isLoading,
    error: state.error,
    loadDirectory,
    uploadFiles,
    downloadFile,
    deleteFile,
    moveFile,
    copyFile,
  };
}