import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import RootState from '../types/RootState';
import { actions } from '../reducers/auth';

interface Props extends RouteComponentProps<any> {
  dispatch: Dispatch<RootState>;
}

class Logout extends React.Component<Props, {}> {
  componentWillMount() {
    this.props.dispatch(actions.logoutSuccess());
    this.props.history.push('/');
  }

  render() {
    return null;
  }
}

export default withRouter(connect()(Logout));
