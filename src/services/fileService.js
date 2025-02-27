class TrieNode {
  constructor() {
    this.children = {}; // Map from segment to TrieNode
    this.isFile = false; // Flag to indicate a file node
    this.fileData = null; // Store file metadata if it's a file
  }
}


/**
 * FileService
 *
 * This service is responsible for managing the file system on the client side.
 * It uses a trie data structure to store the file system. The trie allows for
 * efficient navigation and retrieval of files and directories.
 *
 * @class FileService
 */
class FileService {
  constructor() {
    this.baseUrl = import.meta.env.VITE_ARTOO_API_URL;

    // Initialize trie structure for client-side file system
    this.root = new TrieNode();
    this.isLoaded = false;
    this.isLoading = false;
    this.error = null;
  }

  /**
   * Lists the contents of a directory.
   *
   * This method fetches the contents of a directory from the server or uses cached data if available.
   * It normalizes the path, checks for cached data, and if not found, makes a network request to fetch the directory contents.
   * The fetched data is then used to update the file system trie structure.
   *
   * @param {string} path - The path of the directory to list.
   * @returns {Promise<Array>} A promise that resolves to an array of file objects.
   */
  async listDirectory(path) {
    // cache check
    if (this.isLoaded) {
      const cachedContents = this.getDirectoryContents(path);
      if (cachedContents && cachedContents.files.length > 0) {
        return cachedContents.files;
      }
    }

    // network request
    let normalizedPath = path === '/' ? '' : path;
    if (normalizedPath.startsWith('/')) {
      normalizedPath = normalizedPath.slice(1);
    }
    const response = await fetch(`${this.baseUrl}/files?path=${encodeURIComponent(normalizedPath)}`);
    if (!response.ok) {
      throw new Error('Failed to list directory');
    }
    const data = await response.json();

    const files = Array.isArray(data.files) ? data.files : [];

    // update the trie with the new data
    this.updateFileSystem(files);

    return files;
  }

  /**
   * Initiates the loading of the file system from the server.
   *
   * This method is responsible for fetching all files from the server and constructing the trie structure.
   * Upon successful completion, it sets the `isLoaded` flag to `true`, indicating that the file system has been successfully loaded.
   *
   * @returns {Promise<void>} A promise that resolves when the file system has been loaded.
   */
  async loadFileSystem() {
    if (this.isLoaded || this.isLoading) return;

    try {
      this.isLoading = true;
      this.error = null;

      // get all files from the backend
      const files = await this.listDirectory('');

      this.root = new TrieNode();
      files.forEach(file => {
        this.insertFile(file.name, file);
      });

      this.isLoaded = true;
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to load file system';
      throw err;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Updates the file system trie structure with the new data.
   *
   * This method iterates over the files and inserts them into the trie structure.
   * It also sets the isLoaded flag to true to indicate that the file system has been loaded.
   *
   * @param {Array} files - The array of file objects to insert into the trie.
   */
  updateFileSystem(files) {
    files.forEach(file => {
      this.insertFile(file.name, file);
    });
    this.isLoaded = true;
  }

  /**
   * Inserts a file into the trie structure.
   *
   * This method iterates through the file path, creating or navigating to the corresponding nodes in the trie structure.
   * It marks the final node as a file and stores the file data.
   *
   * @param {string} filePath - The path of the file to insert.
   * @param {Object} fileData - The metadata of the file to insert.
   */
  insertFile(filePath, fileData) {
    // console.log('insertFile filePath', filePath, fileData)
    const normalizedPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
    const parts = normalizedPath.split('/');
    let node = this.root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (!part) continue; // Skip empty parts

      if (!node.children[part]) {
        node.children[part] = new TrieNode();
      }
      node = node.children[part];
    }

    node.isFile = true;
    node.fileData = fileData;
  }

  /**
   * Retrieves the contents of a specified directory from the trie structure.
   *
   * This method navigates through the trie structure based on the provided path and returns an object containing the directories and files within the specified directory.
   *
   * @param {string} path - The path of the directory to retrieve contents from.
   * @returns {{directories: Array, files: Array}} An object containing arrays of directories and files within the specified directory.
   */
  getDirectoryContents(path) {
    if (!this.isLoaded) {
      return { directories: [], files: [] };
    }

    const normalizedPath = path === '/' ? '' : path.startsWith('/') ? path.slice(1) : path;
    const parts = normalizedPath ? normalizedPath.split('/').filter(Boolean) : [];

    let node = this.root;
    for (const part of parts) {
      if (!node.children[part]) {
        return { directories: [], files: [] };
      }
      node = node.children[part];
    }

    const directories = [];
    const files = [];

    for (const key in node.children) {
      const child = node.children[key];
      const childPath = normalizedPath ? `${normalizedPath}/${key}` : key;

      if (child.isFile) {
        files.push(child.fileData);
      } else {
        directories.push({
          name: key,
          path: `/${childPath}`
        });
      }
    }

    return { directories, files };
  }

  /**
   * Builds and returns the folder structure of the file system.
   *
   * This method recursively traverses the trie structure to construct a tree representation of the file system.
   * The tree only includes directories and their subdirectories, excluding files.
   *
   * @returns {Array} An array of folder objects, each containing a name, path, and children.
   */
  getFolderStructure() {
    if (!this.isLoaded) {
      return [];
    }

    const buildFolderTree = (node, path = '/') => {
      const folders = [];

      for (const key in node.children) {
        const child = node.children[key];
        if (!child.isFile || Object.keys(child.children).length > 0) {
          const childPath = path === '/' ? `/${key}` : `${path}/${key}`;
          folders.push({
            name: key,
            path: childPath,
            children: buildFolderTree(child, childPath)
          });
        }
      }

      return folders;
    };

    return [{
      name: 'root',
      path: '/',
      children: buildFolderTree(this.root)
    }];
  }

  /**
   * Uploads a file to the server.
   *
   * This method creates a FormData object, appends the file and path to it, and sends it to the server.
   *
   * @param {File} file - The file to upload.
   * @param {string} path - The path to upload the file to.
   * @returns {Promise<Object>} A promise that resolves to the response from the server.
   */
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