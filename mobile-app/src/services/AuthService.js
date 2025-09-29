/**
 * Authentication Service for Khel-Dristi
 * Handles user login, registration, and session management
 */
export class AuthService {
  static baseURL = 'http://localhost:3001/api/auth';
  static currentUser = null;
  static authToken = null;

  /**
   * Login user with email and password
   */
  static async login(email, password) {
    try {
      // For demo purposes, accept any credentials
      // In production, this would make API call to backend
      if (email && password) {
        // Mock successful login
        this.currentUser = {
          id: 'demo_user_123',
          name: 'Demo User',
          email: email,
          sport: 'Track & Field',
          state: 'Maharashtra',
          district: 'Mumbai'
        };
        
        this.authToken = 'demo_token_' + Date.now();
        
        return {
          success: true,
          user: this.currentUser,
          token: this.authToken
        };
      }
      
      return {
        success: false,
        error: 'Invalid credentials'
      };
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        error: 'Network error'
      };
    }
  }

  /**
   * Register new user
   */
  static async register(userData) {
    try {
      const {
        name,
        email,
        password,
        age,
        gender,
        sport,
        state,
        district,
        phoneNumber
      } = userData;

      // Basic validation
      if (!name || !email || !password) {
        return {
          success: false,
          error: 'Name, email, and password are required'
        };
      }

      // Mock successful registration
      this.currentUser = {
        id: 'user_' + Date.now(),
        name,
        email,
        age,
        gender,
        sport,
        state,
        district,
        phoneNumber,
        createdAt: new Date()
      };

      this.authToken = 'token_' + Date.now();

      return {
        success: true,
        user: this.currentUser,
        token: this.authToken
      };
    } catch (error) {
      console.error('Registration failed:', error);
      return {
        success: false,
        error: 'Registration failed'
      };
    }
  }

  /**
   * Check if user is authenticated
   */
  static async checkAuthStatus() {
    // Mock implementation - in production would check stored token
    return this.currentUser !== null && this.authToken !== null;
  }

  /**
   * Logout user
   */
  static async logout() {
    this.currentUser = null;
    this.authToken = null;
    return { success: true };
  }

  /**
   * Get current user
   */
  static getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Get auth token
   */
  static getAuthToken() {
    return this.authToken;
  }

  /**
   * Update user profile
   */
  static async updateProfile(updates) {
    try {
      if (!this.currentUser) {
        return {
          success: false,
          error: 'User not authenticated'
        };
      }

      // Update current user object
      this.currentUser = {
        ...this.currentUser,
        ...updates,
        updatedAt: new Date()
      };

      return {
        success: true,
        user: this.currentUser
      };
    } catch (error) {
      console.error('Profile update failed:', error);
      return {
        success: false,
        error: 'Failed to update profile'
      };
    }
  }

  /**
   * Reset password (mock implementation)
   */
  static async resetPassword(email) {
    try {
      // Mock password reset
      console.log('Password reset requested for:', email);
      
      return {
        success: true,
        message: 'Password reset instructions sent to your email'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to send reset instructions'
      };
    }
  }
}