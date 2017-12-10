import AuthService from '../utils/AuthService';

const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID || '';
const domain = process.env.REACT_APP_AUTH0_DOMAIN || '';

const authService = new AuthService(clientId, domain);
const SUPERUSER = 'SUPERUSER';

const constants = {
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  LOGOUT_SUCCESS: 'LOUGOUT_SUCCESS',
};

export default (state = {
  isAuthenticated: authService.isLoggedIn(),
  isFetching: false,
  profile: authService.getProfile(),
  error: null,
},              action) => {
  switch (action.type) {
    case constants.LOGIN_REQUEST:
      return {
        ...state,
        isFetching: true,
        error: null,
      };

    case constants.LOGIN_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        profile: action.profile,
      };

    case constants.LOGIN_ERROR:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        profile: {},
        error: action.error,
      };

    case constants.LOGOUT_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
        profile: {},
      };

    default:
      return state;
  }
};

const loginUser = (username, password) => (dispatch) => {
  dispatch({type: constants.LOGIN_REQUEST});
  authService.auth0.redirect.loginWithCredentials({
    connection: 'Username-Password-Authentication',
    username,
    password,
  }, (error) => {
    if (error) {
      return dispatch(loginError(error));
    }
  });
};

const checkLogin = (hash) => (dispatch) => {
  authService.auth0.parseHash({hash, _idTokenVerfication: false}, (error, authResult) => {
    if (error) {
      alert(`Error: ${error.errorDescription}`);
    }

    if (authResult && authResult.accessToken && authResult.idToken) {
      authService.setToken(authResult.accessToken, authResult.idToken);

      authService.auth0.client.userInfo(authResult.accessToken, (clientError, profile) => {
        if (clientError) {
          return dispatch(loginError(error));
        } else {
          authService.setProfile(profile);
          return dispatch(loginSuccess(profile));
        }
      });
    }
  });
};

const isSuperUser = (state) => {
  let i = 0;

  if (!state.auth.profile.roles) {
    return false;
  }

  const iLen = state.auth.profile.roles.length;

  for (; i < iLen; ++i) {
    if (state.auth.profile.roles[i] === SUPERUSER) {
      return true;
    }
  }

  return false;
};

const isAuthenticated = (state) => {
  return state.isAuthenticated;
};

const loginError = (error) => {
  return {
    type: constants.LOGIN_ERROR,
    error,
  };
};

const loginSuccess = (profile) => {
  return {
    type: constants.LOGIN_SUCCESS,
    profile,
  };
};

const logoutSuccess = () => {
  authService.logout();
  return {type: constants.LOGOUT_SUCCESS};
};

export const actions = {
  isSuperUser,
  loginUser,
  checkLogin,
  isAuthenticated,
  loginError,
  logoutSuccess,
};
