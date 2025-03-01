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

  return {
    currentDirectory: state.currentDirectory,
    folderStructure: state.folderStructure,
    selectedFiles: state.selectedFiles,
    isLoading: state.isLoading,
    error: state.error,
    loadDirectory,
    uploadFiles,
  };
}