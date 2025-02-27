import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { fileService } from '../services/fileService';

const initialState = {
  currentDirectory: {
    path: '/',
    directories: [],
    files: []
  },
  folderStructure: [],
  selectedFiles: [],
  isLoading: false,
  error: null,
};


function fileSystemReducer(state, action) {
  switch (action.type) {
    case 'SET_CONTENTS':
      const contents = Array.isArray(action.payload) ? action.payload : [action.payload];
      const nodes = contents.reduce((acc, node) => {
        acc[node.id] = node;
        return acc;
      }, {});
      return { ...state, nodes };

    case 'SET_CURRENT_DIRECTORY':
      return {
        ...state,
        currentDirectory: {
          path: action.payload.path,
          directories: action.payload.directories || [],
          files: action.payload.files || []
        }
      };

    case 'SET_FOLDER_STRUCTURE':
      return { ...state, folderStructure: action.payload };

    case 'SET_SELECTED_FILES':
      return { ...state, selectedFiles: action.payload };


    case 'SET_OPERATION':
      return {
        ...state,
        operations: {
          ...state.operations,
          [action.payload.id]: action.payload.operation
        }
      };


    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    default:
      return state;
  }
}

const FileSystemContext = createContext(undefined);

export function FileSystemProvider({ children }) {
  const [state, dispatch] = useReducer(fileSystemReducer, initialState);

  // load the file system on mount
  useEffect(() => {
    async function loadFileSystem() {
      dispatch({ type: 'SET_LOADING', payload: true });

      try {
        await fileService.loadFileSystem();

        // folder structure
        const folderStructure = fileService.getFolderStructure();
        dispatch({ type: 'SET_FOLDER_STRUCTURE', payload: folderStructure });

        // initial directory contents
        const { directories, files } = fileService.getDirectoryContents('/');
        dispatch({
          type: 'SET_CURRENT_DIRECTORY',
          payload: {
            path: '/',
            directories,
            files
          }
        });

        dispatch({ type: 'SET_ERROR', payload: null });

      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }

    loadFileSystem();
  }, []);

  return (
    <FileSystemContext.Provider value={{ state, dispatch }}>
      {children}
    </FileSystemContext.Provider>
  );
}

export function useFileSystem() {
  const context = useContext(FileSystemContext);
  if (context === undefined) {
    throw new Error('useFileSystem must be used within a FileSystemProvider');
  }
  return context;
}