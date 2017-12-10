import * as React from 'react';

import { RouteComponentProps } from 'react-router';

interface Props extends RouteComponentProps<any> {
  checkLogin: (hash: string) => void;
  isAuthenticated: boolean;
}

class Callback extends React.Component<Props> {
  componentDidMount() {
    this.props.checkLogin(window.location.hash);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.isAuthenticated) {
      nextProps.history.push('/');
    }
  }

  render() {
    return null;
  }
}

export default Callback;
