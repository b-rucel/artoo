class FileService {
  constructor() {
    // this.baseUrl = import.meta.env.VITE_API_URL;
    this.baseUrl = 'https://artoo-api.brucelim.workers.dev/api';
  }

  async listDirectory(path) {
    const response = await fetch(`${this.baseUrl}/files?path=${encodeURIComponent(path)}`);
    if (!response.ok) {
      throw new Error('Failed to list directory');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];  // Ensure we always return an array
  }

  async uploadFile(file, path) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);

    const response = await fetch(`${this.baseUrl}/files`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }
    return response.json();
  }

  // Additional methods for other file operations
}

export const fileService = new FileService(); 