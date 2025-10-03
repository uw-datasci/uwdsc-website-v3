export interface AuthMiddlewareResult {
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  shouldRedirect: boolean;
  redirectUrl?: string;
}

export class AuthMiddleware {
  async checkAuth(baseUrl: string, pathname: string): Promise<AuthMiddlewareResult> {
    try {
      
      const response = await fetch(`${baseUrl}/api/auth/me`);
      
      const isAuthenticated = response.ok;
      let isEmailVerified = false;

      if (isAuthenticated) {
        const userData = await response.json();
        isEmailVerified = !!userData.user?.email_confirmed_at;
      } else {
        const errorData = await response.text();
      }

      if (isAuthenticated) {

        if (!isEmailVerified && pathname !== '/verify-email') {
          const result = {
            isAuthenticated,
            isEmailVerified,
            shouldRedirect: true,
            redirectUrl: '/verify-email'
          };
          return result;
        }
        
        if (isEmailVerified && (pathname === '/login' || pathname === '/register')) {
          const result = {
            isAuthenticated,
            isEmailVerified,
            shouldRedirect: true,
            redirectUrl: '/me'
          };
          return result;
        }
        
        if (isEmailVerified && pathname === '/verify-email') {
          const result = {
            isAuthenticated,
            isEmailVerified,
            shouldRedirect: true,
            redirectUrl: '/me'
          };
          return result;
        }
      } else {
        if (pathname === '/verify-email') {
          const result = {
            isAuthenticated,
            isEmailVerified,
            shouldRedirect: false
          };
          return result;
        }
      }

      const result = {
        isAuthenticated,
        isEmailVerified,
        shouldRedirect: false
      };
      
      return result;
    } catch (error) {
      return {
        isAuthenticated: false,
        isEmailVerified: false,
        shouldRedirect: false
      };
    }
  }
}