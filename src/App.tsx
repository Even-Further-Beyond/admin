import * as React from 'react';
import { Link, Route } from 'react-router-dom';
import * as History from 'history';
import injectTapEventPlugin from 'react-tap-event-plugin';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Tabs, Tab } from 'material-ui/Tabs';

import styled from 'styled-components';

import Login from './containers/Login';
import Logout from './containers/Logout';
import Callback from './containers/Callback';
import UserControlPanel from './containers/UserControlPanel';
import CharacterDataEntry from './containers/CharacterDataEntry';
import TagEditor from './containers/TagEditor';
import RequireAuth from './containers/RequireAuth';

injectTapEventPlugin();

const AppDiv = styled.div`
  text-align: center;
`;

const BodyDiv = styled.div`
  padding: 25px;
  flex-grow: 1;
  @media only screen and (min-width: 1200px) {
    width: 1200px;
    margin: auto;
  }
`;

interface Props {
  isAuthenticated: boolean;
  location: History.Location;
}

interface State {
  tabValue: string;
}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    let pathname = 'user';

    if (this.props.location.pathname !== '/' && this.props.location.pathname !== '/callback') {
      pathname = this.props.location.pathname;
    }

    this.state = {
      tabValue: pathname,
    };
  }

  handleChange = (value) => {
    this.setState({tabValue: value});
  }

  renderTabLinks() {
    if (this.props.isAuthenticated) {
      const style = {
          borderRight: '1px solid black',
      };

      return (
        <Tabs
          value={this.state.tabValue}
          onChange={this.handleChange}
        >
          <Tab
            label='User Control Panel'
            value='/user'
            containerElement={<Link to='/user' />}
            buttonStyle={style}
          />
          <Tab
            label='Character Data Entry'
            value='/dataentry'
            containerElement={<Link to='/dataentry' />}
            buttonStyle={style}
          />
          <Tab
            label='Tag Editor'
            value='/tageditor'
            containerElement={<Link to='/tageditor' />}
            buttonStyle={style}
          />
          <Tab
            label='Logout'
            value='/logout'
            buttonStyle={{backgroundColor: 'rgb(186, 104, 200)'}}
            containerElement={<Link to='/logout' />}
          />
        </Tabs>
      );
    }

    return null;
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <AppDiv>
          <BodyDiv>
            {this.renderTabLinks()}
            <Route path='/' exact={true} component={this.props.isAuthenticated ? UserControlPanel : Login} />
            <Route path='/user' component={UserControlPanel} />
            <Route path='/login' component={Login} />
            <Route path='/callback' component={Callback} />
            <Route path='/dataentry' component={CharacterDataEntry} />
            <Route path='/tageditor' component={TagEditor} />
            <Route path='/logout' component={Logout} />
            </BodyDiv>
        </AppDiv>
      </MuiThemeProvider>
    );
  }
}

export default RequireAuth(App, true);
