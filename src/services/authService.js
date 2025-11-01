import axios from 'axios';

// The base URL for your running Spring Boot backend
const API_URL = 'http://localhost:8080/api/auth'; 

const authService = {
  
  /**
   * Sends user data to the backend to create a new account.
   * @param {object} userData - {name, email, password}
   */
  register: async (userData) => {
    try {
      // POST request to http://localhost:8080/api/auth/register
      const response = await axios.post(`${API_URL}/register`, userData);
      return response.data; // Should return "User registered successfully!"
    } catch (error) {
      // Log and throw the error message from the backend
      throw error.response?.data || 'Registration failed due to network error.';
    }
  },

  /**
   * Sends credentials to the backend to get a JWT token.
   * @param {object} credentials - {email, password}
   * @returns {string} The JWT token string.
   */
  login: async (credentials) => {
    try {
      // POST request to http://localhost:8080/api/auth/login
      const response = await axios.post(`${API_URL}/login`, credentials);
      const token = response.data.token;
      
      // Save the JWT to local storage on successful login
      if (token) {
        localStorage.setItem('token', token); // CRITICAL STEP
      }
      return token;
    } catch (error) {
      // Log and throw the error message (e.g., Invalid credentials)
      throw error.response?.data || 'Login failed due to network error.';
    }
  },

  /**
   * Clears the token from local storage (used by the Logout button).
   */
  logout: () => {
    localStorage.removeItem('token');
  },

  /**
   * Checks if a user is currently logged in.
   */
  getCurrentToken: () => {
    return localStorage.getItem('token');
  }
};

export default authService;