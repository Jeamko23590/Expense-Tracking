/**
 * Application Configuration
 * Uses environment variables for deployment flexibility
 */

// API base URL - defaults to localhost for development
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
