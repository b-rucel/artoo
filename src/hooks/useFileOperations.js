import { useCallback } from 'react';
import { useFileSystem } from '../context/FileSystemContext.jsx';
import { fileService } from '../services/fileService.js';

export function useFileOperations() {
  const { state, dispatch } = useFileSystem();

  const loadDirectory = useCallback(async (path) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const contents = await fileService.listDirectory(path);

      dispatch({ type: 'SET_CONTENTS', payload: contents });
      dispatch({ type: 'SET_CURRENT_DIRECTORY',
        payload: {
          path,
          contents
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


  const uploadFiles = useCallback(async (files) => {
    const operationId = crypto.randomUUID();
    try {
      dispatch({
        type: 'SET_OPERATION',
        payload: {
          id: operationId,
          operation: { type: 'upload', status: 'pending' }
        }
      });

      // Upload implementation...

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
  }, [dispatch, state.currentDirectory]);

  return {
    currentDirectory: state.currentDirectory,
    selectedFiles: state.selectedFiles,
    isLoading: state.isLoading,
    error: state.error,
    loadDirectory,
    uploadFiles,
  };
}