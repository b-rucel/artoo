import { createContext, useContext } from 'react'

const ApiContext = createContext()

export function ApiProvider({ children }) {
  // Basic API functions for Cloudflare Workers
  const api = {
    // List contents of a directory
    listDirectory: async (path) => {
      try {
        const response = await fetch(`/api/files?path=${encodeURIComponent(path)}`)
        if (!response.ok) throw new Error('Failed to list directory')
        return response.json()
      } catch (error) {
        console.error('List directory error:', error)
        throw error
      }
    },

    // Upload a file
    uploadFile: async (file, path) => {
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('path', path)

        const response = await fetch('/api/files', {
          method: 'POST',
          body: formData
        })
        
        if (!response.ok) throw new Error('Failed to upload file')
        return response.json()
      } catch (error) {
        console.error('Upload error:', error)
        throw error
      }
    },

    // Delete a file
    deleteFile: async (path) => {
      try {
        const response = await fetch(`/api/files?path=${encodeURIComponent(path)}`, {
          method: 'DELETE'
        })
        
        if (!response.ok) throw new Error('Failed to delete file')
        return response.json()
      } catch (error) {
        console.error('Delete error:', error)
        throw error
      }
    }
  }

  return (
    <ApiContext.Provider value={api}>
      {children}
    </ApiContext.Provider>
  )
}

// Custom hook to use the API
export function useApi() {
  const context = useContext(ApiContext)
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider')
  }
  return context
} 