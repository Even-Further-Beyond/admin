import * as React from 'react';
import { Card, CardHeader, CardText } from 'material-ui/Card';

interface Props {
  isAuthenticated: boolean;
  isSuperUser: boolean;
  profile: any;
}

class User extends React.Component<Props, {}> {
  renderCardText() {
    if (this.props.isAuthenticated) {
      return (
        <CardText>
          You are now logged in as {this.props.profile.email}.
          Account created on {this.props.profile.created_at}.
          You {this.props.isSuperUser ?  '' : ' do not '} have superuser permission.
        </CardText>
      );
    }

    return null;
  }

  render() {
    return (
      <Card>
        <CardHeader
            title='User Control Panel'
        />
        {this.renderCardText()}
      </Card>
    );
  }
}

export default User;
