import { connect } from 'react-redux';

import { actions } from '../reducers/auth';
import RootState from '../types/RootState';
import Callback from '../components/Login/Callback';

const mapStateToProps = (state: RootState) => {
  return { isAuthenticated: actions.isAuthenticated(state.auth) };
};

const mapDispatchToProps = (dispatch) => {
  return {
    checkLogin(hash: string) {
      dispatch(actions.checkLogin(hash));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Callback);
