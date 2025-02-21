import React, { createContext, useContext, useReducer } from 'react';

const initialState = {
  nodes: {},
  currentDirectory: {
    path: '/',
    contents: []
  },
  selectedFiles: [],
  operations: {},
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
          contents: action.payload.contents || []
        }
      };

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