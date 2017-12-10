import { connect } from 'react-redux';

import { actions } from '../reducers/auth';
import Login from '../components/Login';
import RootState from '../types/RootState';

const mapStateToProps = (state: RootState) => {
  return {
    isAuthenticated: actions.isAuthenticated(state.auth),
    errorMessage: state.auth.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loginUser(username: string, password: string) {
      dispatch(actions.loginUser(username, password));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
