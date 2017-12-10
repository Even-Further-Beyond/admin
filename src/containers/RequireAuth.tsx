import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { actions } from '../reducers/auth';

export default function(DecoratedComponent: React.ComponentClass, forceRender: boolean) {
  interface Props extends RouteComponentProps<any> {
    isAuthenticated: boolean;
  }

  const mapStateToProps = (state) => {
    return { isAuthenticated: actions.isAuthenticated(state.auth) };
  };

  class Authentication extends React.Component<Props, {}> {
    componentWillMount() {
      if (!this.props.isAuthenticated && window.location.pathname !== '/callback') {
        this.props.history.push('/');
      }
    }

    componentWillUpdate(nextProps: {isAuthenticated: boolean}) {
      if (!nextProps.isAuthenticated && !forceRender) {
        this.props.history.push('/');
      }
    }

    render() {
      if (this.props.isAuthenticated || forceRender) {
        return (
            <DecoratedComponent {...this.props} />
          );
        }

      return null;
    }
  }

  return withRouter(connect(mapStateToProps)(Authentication));
}
