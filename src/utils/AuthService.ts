import { EventEmitter } from 'events';
import { isTokenExpired } from './jwtHelper';
import * as auth0 from 'auth0-js';

class AuthService extends EventEmitter {
  auth0: {
    redirect: {
      loginWithCredentials: ({}: object, authResult: {}) => void,
    }
    parseHash: ({}: object, error: {}) => void,
    client: {
      userInfo: (accessToken: string, profile: {}) => void,
    },
  };

  constructor(clientId: string, domain: string) {
    super();

    this.auth0 = new auth0.WebAuth({
      clientID: clientId,
      domain,
      redirectUri: process.env.REACT_APP_AUTH0_REDIRECT_URI,
      scope: 'openid email profile',
      responseType: 'token id_token',
    });
  }

  isLoggedIn() {
    const token = this.getToken();
    return !!token && !isTokenExpired(token);
  }

  setToken(accessToken: string, idToken: string) {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('id_token', idToken);
  }

  getToken() {
    return localStorage.getItem('id_token');
  }

  setProfile(profile: {}) {
    localStorage.setItem('profile', JSON.stringify(profile));
    this.emit('profile_updated', profile);
  }

  getProfile() {
    const profile = localStorage.getItem('profile');
    return profile ? JSON.parse(localStorage.profile) : {};
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
  }
}

export default AuthService;
