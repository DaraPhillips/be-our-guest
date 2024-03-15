// AuthService.js
class AuthService {
  // ... other methods

  static logout() {
    // Logic to log the user out, clear tokens, etc.
    // For example, if using JWT, you might remove the token from local storage.
    localStorage.removeItem('jwtToken');
  }
}

export default AuthService;