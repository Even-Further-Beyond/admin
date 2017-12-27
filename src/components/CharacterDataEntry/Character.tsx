import * as React from 'react';
import { graphql } from 'react-apollo';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import styled from 'styled-components';

// import UploadModal from './UploadModal';
import TagAutoComplete from './TagAutoComplete';
import * as types from '../../types/data';
import UPDATE_CHARACTER_MUTATION from '../../mutations/updateCharacter';
import styles from '../../styles';

const CharacterDiv = styled.div`
  margin: 0 auto;
  border: 1px solid ${styles.primaryTextColor};
  width: 1200px;
  height: 575px;
  position: relative;
  img {
    float: left;
  }
`;

const CharacterInfoDiv = styled.div`
  margin: 10px 0px;
  span {
    margin-right: 30px;
  }
`;

const CharacterInputDiv = styled.div`
  display: flex;
  flex-direction: row;
  flex-flow: row wrap;
`;

const TextBoxes = styled.div`
  margin-left: 5px;
  label {
    margin-left: 10px;
  }
`;

const ComboBox = styled.div`
  height: 20px;
  margin: 15px 10px;
  label {
    margin-left: 15px;
  }
`;

interface InputProps {
  character: types.Character;
  traits: types.CharacterTraits;
  tags: types.Tag[];
  updateToggle: boolean;
  wait: number;
  isSuperUser: boolean;
}

interface Props extends InputProps {
  updateCharacterMutation: ({}: {}) => Promise<{data: types.Character}>;
}

interface State {
  ageStart?: number;
  ageEnd?: number;
  weightStart?: number;
  weightEnd?: number;
  heightStart?: number;
  heightEnd?: number;
  selectedGenderId?: string;
  selectedHairLengthId?: string;
  selectedHairColorIds?: string[];
  selectedEyeColorIds?: string[];
  selectedAgeGroupIds?: string[];
  selectedTagIds?: string[];
  updateMessage?: string;
  showUploadModal: boolean;
  uploadedImage?: string;
}

class Character extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const character = props.character;
    const selectedHairColorIds = [];
    const selectedEyeColorIds = [];
    const selectedAgeGroupIds = [];
    const selectedTagIds = [];

    for (let i = 0; i < character.hairColors.length; i++) {
      selectedHairColorIds.push(character.hairColors[i].id);
    }

    for (let i = 0; i < character.eyeColors.length; i++) {
      selectedEyeColorIds.push(character.eyeColors[i].id);
    }

    for (let i = 0; i < character.ageGroups.length; i++) {
      selectedAgeGroupIds.push(character.ageGroups[i].id);
    }

    for (let i = 0; i < props.character.tags.length; i++) {
      selectedTagIds.push(props.character.tags[i].id);
    }

    this.state = {
      ageStart: character.ageStart,
      ageEnd: character.ageEnd,
      weightStart: character.weightStart,
      weightEnd: character.weightEnd,
      heightStart: character.heightStart,
      heightEnd: character.heightEnd,
      selectedGenderId: character.gender ? character.gender.id : null,
      selectedHairLengthId: character.hairLength ? character.hairLength.id : null,
      selectedHairColorIds,
      selectedEyeColorIds,
      selectedAgeGroupIds,
      selectedTagIds,
      updateMessage: null,
      showUploadModal: false,
      uploadedImage: null,
    };
  }

  componentWillReceiveProps(nextProps: InputProps) {
    if (nextProps.updateToggle !== this.props.updateToggle) {
      setTimeout(() => {
        this.updateCharacter();
      }, this.props.wait);
    }
  }

  onClick = (selected: string, id: number) => {
    const object = {};

    object[selected] = id;
    this.setState(object);
  }

  onMultiClick = (selected: string, id: number) => {
    const object = {};
    const newState = this.state[selected];
    const index = newState.indexOf(id);

    (index !== -1) ? newState.splice(index, 1) : newState.push(id);
    object[selected] = newState;

    this.setState(object);
  }

  handleChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const input = (event.target as HTMLInputElement);

    const object = {};
    let value = input.type === 'checkbox' ? input.checked : input.value;
    const name = input.name;

    if (value === '') {
      value = null;
    }

    object[name] = value;
    this.setState(object);
  }

  updateSelectedTagIds = (selectedTagIds: string[]) => {
    this.setState({selectedTagIds});
  }

  openUploadModal = () => {
    this.setState({showUploadModal: true});
  }

  closeUploadModal = () => {
    this.setState({showUploadModal: false});
  }

  setImage = (image: string) => {
    this.setState({uploadedImage: image});
  }

  updateCharacter = () => {
    const character = {
      id: this.props.character.id,
      ageStart: this.state.ageStart,
      ageEnd: this.state.ageEnd,
      heightStart: this.state.heightStart,
      heightEnd: this.state.heightEnd,
      weightStart: this.state.weightStart,
      weightEnd: this.state.weightEnd,
      genderId: this.state.selectedGenderId,
      hairLengthId: this.state.selectedHairLengthId,
      hairColorIds: this.state.selectedHairColorIds,
      eyeColorIds: this.state.selectedEyeColorIds,
      ageGroupIds: this.state.selectedAgeGroupIds,
      tagIds: this.state.selectedTagIds,
    };

    this.setState({updateMessage: 'Updating.... '});

    this.props.updateCharacterMutation({
      variables: { character },
    })
    .then(({ data }) => {
      this.setState({updateMessage: 'Character updated successfully'});
    }).catch((error) => {
      this.setState({updateMessage: 'Error trying to update character. Please try again.'});
    });
  }

  renderTextBoxes() {
    const attributes = {
      ageStart: 'Age Start',
      ageEnd: 'Age End',
      weightStart: 'Weight Start',
      weightEnd: 'Weight End',
      heightStart: 'Height Start',
      heightEnd: 'Height End',
    };

    const textBoxes = [];

    for (const key of Object.keys(attributes)) {
      textBoxes.push(
        <span style={{marginLeft: '10px'}} key={key}>
          <label>
            {attributes[key]}:
          </label>
          <TextField
            name={key}
            value={this.state[key] || ''}
            onChange={this.handleChange}
            style={{width: 50, margin: '0 8px'}}
          />
        </span>,
      );
    }

    return textBoxes;
  }

  renderSingleSelect(traitType: string, type: string) {
    const selected = `selected${type}Id`;

    const style = { marginLeft: '10px' };

    const attr = this.props.traits[traitType].map((trait, index) =>
      (
        <RaisedButton
          labelStyle={{ fontSize: '12px'}}
          style={style}
          onClick={() => this.onClick(selected, trait.id)}
          key={trait.id}
          label={trait.description}
          primary={this.state[selected] === trait.id || (this.state[selected] === null && !trait)}
        />
      ),
    );

    return (
      <ComboBox>
        <label>{type.replace(/([A-Z])/g, ' $1').trim()}:</label>
        <RaisedButton
          style={style}
          labelStyle={{ fontSize: '12px'}}
          onClick={() => this.onClick(selected, null)}
          key={0}
          label='None'
          primary={this.state[selected] === null}
        />
        {attr}
      </ComboBox>
    );
  }

  renderMultiSelect(traitType: string, type: string, colorStyle?: boolean) {
    const selected = `selected${type}Ids`;

    const style = {
      marginLeft: '7px',
      lineHeight: null,
      minWidth: null,
    };
    const labelStyle = { fontSize: '12px' };
    const buttonStyle = { minWidth: null };

    if (colorStyle) {
      style.lineHeight = '8px';
      style.minWidth = '50px';
      labelStyle.fontSize = '9px';
      buttonStyle.minWidth = '50px';
    }

    const attr = this.props.traits[traitType].map((trait, index) =>
      (
        <RaisedButton
          onClick={() => this.onMultiClick(selected, trait.id)}
          style={style}
          labelStyle={labelStyle}
          buttonStyle={buttonStyle}
          label={trait.name}
          key={trait.id}
          primary={this.state[selected].indexOf(trait.id) !== -1}
        />
      ),
    );

    return (
      <ComboBox>
        <label>{type.replace(/([A-Z])/g, ' $1').trim()}s:</label>
        {attr}
      </ComboBox>
    );
  }

  render() {
    const character = this.props.character;
    let imagePath = null;
    let imageLink = null;

    if (character.image) {
        imagePath = character.image.imagePath;
    }

    if (imagePath) {
      imageLink = `https://s3.us-east-2.amazonaws.com/animecharacters.media/images/characters/big/${imagePath}`;
    }

    return (
      <CharacterDiv>
        <a href={'https://myanimelist.net/character/' + character.malId}>
          <img src={this.state.uploadedImage || imageLink} width={160} />
        </a>
        <CharacterInfoDiv>
          <span>Name: {character.name}</span>
          <span>Character ID: {character.id}</span>
          <span>Mal ID: {character.malId}</span>
          <span>Date Modified: {character.updatedAt}</span>
        </CharacterInfoDiv>
        <CharacterInputDiv>
          <TextBoxes>
            {this.renderTextBoxes()}
          </TextBoxes>
          {this.renderSingleSelect('genders', 'Gender')}
          {this.renderSingleSelect('hairLengths', 'HairLength')}
          {this.renderMultiSelect('colors', 'HairColor', true)}
          {this.renderMultiSelect('colors', 'EyeColor', true)}
          {this.renderMultiSelect('ageGroups', 'AgeGroup')}
        </CharacterInputDiv>
        <div>
          <TagAutoComplete
            selectedTagIds={this.state.selectedTagIds}
            tags={this.props.tags}
            updateSelectedTagIds={this.updateSelectedTagIds}
          />
          {/* <RaisedButton
            label='Upload Image'
            secondary={true}
            disabled={!this.props.isSuperUser}
            style={{marginLeft: '50px'}}
            onClick={this.openUploadModal}
          /> */}
          <RaisedButton
            label='Update Character'
            secondary={true}
            style={{marginLeft: '50px'}}
            onClick={this.updateCharacter}
          />
          <span style={{marginLeft: '20px'}}>{this.state.updateMessage}</span>
        </div>
        {/* <UploadModal
          prefix={parseInt(character.id, 10)}
          isOpen={this.state.showUploadModal}
          closeUploadModal={this.closeUploadModal}
          uploadImage={this.setImage}
        /> */}
      </CharacterDiv>
    );
  }
}

export default graphql<{}, InputProps>
(UPDATE_CHARACTER_MUTATION,  { name: 'updateCharacterMutation' })(Character);
