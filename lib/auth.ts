const AUTH_TOKEN_KEY = 'lotus-auth-token';
const MOCK_USER = {
  username: 'admin',
  password: 'password',
  token: 'mock-jwt-token-' + Date.now(),
};

export interface User {
  username: string;
  token: string;
}

export function login(username: string, password: string): Promise<User> {
  return new Promise((resolve, reject) => {
    // Simulate API delay
    setTimeout(() => {
      if (username === MOCK_USER.username && password === MOCK_USER.password) {
        const user: User = {
          username,
          token: MOCK_USER.token,
        };
        
        // Store token in localStorage
        localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(user));
        resolve(user);
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 500);
  });
}

export function logout(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function getToken(): string | null {
  try {
    const userStr = localStorage.getItem(AUTH_TOKEN_KEY);
    if (userStr) {
      const user: User = JSON.parse(userStr);
      return user.token;
    }
  } catch (error) {
    console.error('Error parsing auth token:', error);
  }
  return null;
}

export function getUser(): User | null {
  try {
    const userStr = localStorage.getItem(AUTH_TOKEN_KEY);
    if (userStr) {
      return JSON.parse(userStr);
    }
  } catch (error) {
    console.error('Error parsing user data:', error);
  }
  return null;
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}

export function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
