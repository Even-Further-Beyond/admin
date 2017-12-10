import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { orange500, blue400 } from 'material-ui/styles/colors';

import styled from 'styled-components';

interface Props extends RouteComponentProps<any> {
  loginUser: (username: string, password: string) => void;
  isAuthenticated: boolean;
  errorMessage: { description: string };
}

interface State {
  username?: string;
  password?: string;
}

const LoginDiv = styled.div`
  margin: 150px;
`;

const TextFieldDiv = styled.div`
  margin-top: 15px;
`;

const ButtonDiv = styled.div`
  margin-top: 15px;
`;

const ErrorMessageDiv = styled.div`
  margin-top: 10px;
`;

class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      username: null,
      password: null,
    };
  }

  componentWillMount() {
    if (this.props.isAuthenticated) {
      this.props.history.push('/');
    }
  }

  handleChange = (field: string) => {
    const self = this;

    return (event) => {
      const state = self.state;
      state[field] = event.target.value;
      self.setState(state);
    };
  }

  onClick = () => {
    this.props.loginUser(
      this.state.username,
      this.state.password,
    );
  }

  onEnter = (event: {key: string}) => {
    if (event.key === 'Enter') {
      this.props.loginUser(this.state.username, this.state.password);
    }
  }

  render() {
    const styles = { errorStyle: { color: orange500 } };

    return (
      <LoginDiv onKeyPress={this.onEnter}>
        <h1> Anime Characters Admin Interface </h1>
        <TextFieldDiv>
          <TextField
            hintText='Email'
            errorStyle={styles.errorStyle}
            errorText={!this.state.username ? 'This field is required' : null}
            type='email'
            onChange={this.handleChange('username')}
          />
        </TextFieldDiv>
        <TextFieldDiv>
          <TextField
            hintText='Password'
            errorStyle={styles.errorStyle}
            errorText={!this.state.password ? 'This field is required' : null}
            type='password'
            onChange={this.handleChange('password')}
          />
        </TextFieldDiv>
        <ButtonDiv>
          <RaisedButton
            label='Login'
            primary={true}
            onClick={this.onClick}
            disabled={!this.state.password || !this.state.username}
            disabledBackgroundColor={blue400}
          />
        </ButtonDiv>
        <ErrorMessageDiv>
          <span>
            {this.props.errorMessage ? this.props.errorMessage.description : null}
          </span>
        </ErrorMessageDiv>
      </LoginDiv>
    );
  }
}

export default Login;
