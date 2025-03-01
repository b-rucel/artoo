/**
 * Manages user authentication operations
 * @class
 * @description This class handles user authentication operations such as login, logout, and token verification.
 */
class AuthService {
  /**
   * Creates a new AuthService instance
   * @constructor
   * @description This constructor initializes the base URL for the API and retrieves the authentication token from local storage.
   * @returns {AuthService} A new instance of AuthService
   */
  constructor() {
    this.baseUrl = import.meta.env.VITE_ARTOO_API_URL;
    this.token = localStorage.getItem('auth_token');
  }

  /**
   * Handles user authentication operations including login, logout, and token verification
   * @function
   * @description This function is responsible for managing user authentication by facilitating login, logout, and token verification processes. It also handles the storage and retrieval of the authentication token.
   * @param {string} username - The username of the user to be authenticated
   * @param {string} password - The password of the user to be authenticated
   * @returns {Promise<Object>} A promise that resolves to the response data from the login operation
   * @throws {Error} If the login operation fails
   */
  async login(username, password) {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    this.token = data.token;
    localStorage.setItem('auth_token', data.token);
    return data;
  }

  /**
   * Verifies the validity of the authentication token
   * @function
   * @description This function verifies the validity of the authentication token by sending a request to the server and checking the response
   * @returns {Promise<boolean>} A promise that resolves to true if the token is valid, otherwise false
   */
  async verify() {
    if (!this.token) return false;

    try {
      const response = await fetch(`${this.baseUrl}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: this.token }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.valid;
    } catch (err) {
      return false;
    }
  }

  /**
   * Logs out the user by clearing the authentication token
   * @function
   * @description This function logs out the user by clearing the authentication token from local storage
   */
  logout() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  getToken() {
    return this.token;
  }
}

export const authService = new AuthService();