import * as React from 'react';
import { ChildProps } from 'react-apollo';

import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';

import { Response, InputProps } from '../../types/response/Characters';
import Character from './Character';

interface State {
  updateToggle: boolean;
}

class Characters extends React.Component<ChildProps<InputProps, Response>, State> {
  constructor(props: ChildProps<InputProps, Response>) {
    super(props);

    this.state = {
      updateToggle: false,
    };
  }

  updateAll = () => {
    this.setState({ updateToggle: !this.state.updateToggle });
  }

  renderCharacters() {
    return (
      this.props.data.characters.map((character, index) => (
        <Character
          key={character.id}
          character={character}
          updateToggle={this.state.updateToggle}
          traits={this.props.characterTraits}
          tags={this.props.tags}
          wait={index * 1000}
          isSuperUser={this.props.isSuperUser}
        />
      ))
    );
  }

  render() {
    const { loading, error } = this.props.data;

    if (loading) {
      return <CircularProgress size={160} thickness={5} />;
    }

    if (error) {
      return <span>Error loading characters: {error.message}</span>;
    }

    return (
      <div>
        {this.renderCharacters()}
        <RaisedButton
          style={{marginTop: '15px'}}
          label='Update All Characters'
          onClick={this.updateAll}
          secondary={true}
        />
      </div>
    );
  }
}

export default Characters;
