import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Effect hook to verify the authentication status of the user
   * @function
   * @description This effect hook is used to verify the authentication status of the user by calling the verify method of the authService instance. It sets the isAuthenticated state to true if the token is valid, otherwise it sets it to false.
   */
  useEffect(() => {
    const verifyAuth = async () => {
      const isValid = await authService.verify();
      setIsAuthenticated(isValid);
      setIsLoading(false);
    };

    verifyAuth();
  }, []);

  /**
   * Function to handle user login
   * @function
   * @description This function handles user login by calling the login method of the authService instance. It returns true if the login is successful, otherwise it returns false.
   * @param {string} username - The username of the user to be authenticated
   * @param {string} password - The password of the user to be authenticated
   * @returns {Promise<boolean>} A promise that resolves to true if the login is successful, otherwise false
   * @throws {Error} If the login operation fails
   */
  const login = async (username, password) => {
    try {
      await authService.login(username, password);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}