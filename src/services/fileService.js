class FileService {
  constructor() {
    // this.baseUrl = import.meta.env.VITE_API_URL;
    this.baseUrl = 'https://artoo-api.brucelim.workers.dev/api';
  }

  async listDirectory(path) {
    const normalizedPath = path === '/' ? '' : path;
    const response = await fetch(`${this.baseUrl}/files?path=${encodeURIComponent(normalizedPath)}`);
    if (!response.ok) {
      throw new Error('Failed to list directory');
    }
    const data = await response.json();

    // return Array(data.files); // ensure we always return an array {0:[]}
    return Array.isArray(data.files) ? data.files : [];  // Ensure we always return an array
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