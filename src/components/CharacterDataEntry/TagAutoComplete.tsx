import * as React from 'react';

import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import Chip from 'material-ui/Chip';
import styled from 'styled-components';

import Tag from '../../types/data/Tag';

const ChipDiv = styled.div`
  min-height: 75px;
  margin-top: 15px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
`;

interface Props {
  tags: Tag[];
  selectedTagIds: string[];
  updateSelectedTagIds?: (tags: string[]) => void;
}

interface Suggestion {
  textKey: string;
  valueKey: any;
}

interface State {
  searchableSuggestions: Suggestion[];
  searchText: string;
}

class TagAutoComplete extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const searchableSuggestions = props.tags.filter((tag) =>
      props.selectedTagIds.indexOf(tag.id) === -1,
    ).map((suggestion) => {
      return {
        textKey: suggestion.name,
        valueKey: <MenuItem key={suggestion.id} primaryText={suggestion.name} />,
      };
    });

    this.state = {
      searchableSuggestions,
      searchText: '',
    };
  }

  handleUpdateInput = (text: string) => {
    this.setState({ searchText: text });
  }

  onCompleteRequest = (event: Suggestion, index: number) => {
    if (index > -1) {
      const newSuggestions = this.state.searchableSuggestions.filter((suggestion) =>
        suggestion.valueKey.key !== event.valueKey.key,
      );

      const id = this.state.searchableSuggestions.find(
        (suggestion) => suggestion.valueKey.key === event.valueKey.key,
      );

      const newSelectedTagIds = this.props.selectedTagIds;
      newSelectedTagIds.push(id.valueKey.key);

      this.setState({ searchableSuggestions: newSuggestions });
      this.props.updateSelectedTagIds(newSelectedTagIds);
      (this.refs[`autocomplete`] as AutoComplete).setState({searchText: ''});
    }
  }

  removeTag = (id: string) => {
    const newTags = this.props.selectedTagIds;
    const index = newTags.indexOf(id);
    newTags.splice(index, 1);

    const selectedTag = this.props.tags.find((tag) => tag.id === id);
    const newSuggestions = this.state.searchableSuggestions;

    newSuggestions.push({
        textKey: selectedTag.name,
        valueKey: <MenuItem key={selectedTag.id} primaryText={selectedTag.name} />,
    });

    this.setState({ searchableSuggestions: newSuggestions });
    this.props.updateSelectedTagIds(newTags);
}

  renderChips() {
    const chips = this.props.tags.map((tag) => {
      if (this.props.selectedTagIds.indexOf(tag.id) !== -1) {
        return (
          <Chip
            key={tag.id}
            onRequestDelete={() => this.removeTag(tag.id)}
            style={{margin: '5px 15px', height: '30px'}}
          >
            {tag.name}
          </Chip>
        );
      }

      return null;
    });

    return chips;
  }

  render() {
    return (
      <div>
        <ChipDiv>
          {this.renderChips()}
        </ChipDiv>
        <AutoComplete
          floatingLabelText='Find a tag by name'
          filter={AutoComplete.caseInsensitiveFilter}
          style={{top: '40px', right: '400px'}}
          menuStyle={{maxHeight: '300px', overflowY: 'auto'}}
          dataSource={this.state.searchableSuggestions}
          onUpdateInput={this.handleUpdateInput}
          dataSourceConfig={{text: 'textKey', value: 'valueKey'}}
          onNewRequest={this.onCompleteRequest}
          ref={`autocomplete`}
        />
      </div>
    );
  }
}

export default TagAutoComplete;
