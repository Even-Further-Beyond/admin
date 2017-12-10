import * as React from 'react';

import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import RaisedButton from 'material-ui/RaisedButton';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import ArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import ArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';

import { purple300, orange300 } from 'material-ui/styles/colors';
import styled from 'styled-components';

import * as types from '../../types/data';

const TagDiv = styled.div`
  margin-left: 50px;
  text-align: left;
`;

interface Props {
  nestedTags: types.Tag;
  deleteTag: (tag: types.Tag) => void;
  insertNewTag: (tagFakeIdCounter: number) => void;
  tagFakeIdCounter: number;
  createTagMutation: ({}: {}) => Promise<{data: any}>;
  updateTagMutation: ({}: {}) => Promise<{data: any}>;
  deleteTagMutation: ({}: {}) => Promise<{data: any}>;
  addSaveTag: (id: number, tag: types.Tag) => void;
  isSuperUser: boolean;
  expandTag?: boolean;
}

interface State {
  tag: types.Tag;
  hasBeenEdited: boolean;
  showDeletePrompt: boolean;
  statusMessage: string;
  expandTag: boolean;
}

class Tag extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      tag: props.nestedTags,
      hasBeenEdited: false,
      showDeletePrompt: false,
      statusMessage: null,
      expandTag: false,
    };
  }

  handleTagChange = (event: any, property: string) => {
    const input = (event.target as HTMLInputElement);
    const newTag = this.state.tag;
    const value = input.type === 'checkbox' ? input.checked : input.value;
    newTag[property] = value;

    this.setState({
      tag: newTag,
      hasBeenEdited: true,
    });
  }

  addTag = () => {
    const tagFakeIdCounter = this.props.tagFakeIdCounter + 1;
    const tag = {
      id: null,
      name: '',
      description: '',
      isCategory: false,
      parentId: this.state.tag.id,
      children: [],
      fakeId: this.props.tagFakeIdCounter,
    };
    const modifiedTag = this.state.tag;

    if (!modifiedTag.children) {
      modifiedTag.children = [];
    }

    modifiedTag.children.push(tag);

    this.setState({ tag: modifiedTag });
    this.props.insertNewTag(tagFakeIdCounter);
  }

  cancelDelete = () => {
    this.setState({ showDeletePrompt: false });
  }

  showDeletePrompt = () => {
    if (this.state.tag.id) {
      this.setState({ showDeletePrompt: true });
    } else {
      this.deleteTag();
    }
  }

  saveTag = () => {
    const tag = {
      id: null,
      name: this.state.tag.name,
      parentId: this.state.tag.parentId,
      description: this.state.tag.description,
      isCategory: this.state.tag.isCategory,
      slug: this.state.tag.slug,
    };

    if (this.state.tag.fakeId) {
      this.setState({statusMessage: 'Creating new tag...'});

      this.props.createTagMutation({ variables: { tag } })
      .then(({ data }) => {
        this.props.addSaveTag(this.state.tag.fakeId, data.createTag);

        this.setState({
          statusMessage: 'Created new tag!',
          tag: data.createTag,
        });
      }).catch((error) => {
        this.setState({ statusMessage: error.message });
      });
    } else if (this.state.tag.id) {
      tag.id = this.state.tag.id;
      this.setState({ statusMessage: 'Updating tag...' });

      this.props.updateTagMutation({ variables: { tag } })
      .then(({ data }) => {
        this.setState({
          statusMessage: 'Updated new tag!',
          hasBeenEdited: false,
        });
      }).catch((error) => {
        this.setState({ statusMessage: error.message });
      });
    }
  }

  deleteTag = () => {
    const deletedTag = this.state.tag;

    if (deletedTag.fakeId) {
      this.setState({ tag: null });
      this.props.deleteTag(deletedTag);
    } else {
      this.setState({ statusMessage: 'Deleting tag...', tag: null });

      this.props.deleteTagMutation({ variables: { tagId: this.state.tag.id } })
      .then(({ data }) => {
        this.props.deleteTag(deletedTag);
        this.setState({ statusMessage: 'Deleted tag!', tag: null });
      }).catch((error) => {
        this.setState({ statusMessage: error.message });
      });
    }
  }

  expandTag = () => {
    this.setState({ expandTag: !this.state.expandTag });
  }

  renderAddButton() {
    if (this.state.tag.id && !this.state.showDeletePrompt) {
      return (
        <FloatingActionButton
          onClick={this.addTag}
          style={{marginLeft: '15px'}}
          mini={true}
        >
          <ContentAdd />
        </FloatingActionButton>
      );
    }

    return null;
  }

  renderDeleteButton() {
    if ((!this.state.tag.children || !this.state.tag.children.length || this.state.tag.fakeId)
        && !this.state.showDeletePrompt) {
      return (
        <FloatingActionButton
          onClick={this.showDeletePrompt}
          mini={true}
          secondary={true}
          style={{marginLeft: '15px'}}
        >
          <ContentRemove />
        </FloatingActionButton>
      );
    }

    return null;
  }

  renderSaveButton() {
    if (this.state.hasBeenEdited && !this.state.showDeletePrompt) {
      return (
        <RaisedButton
          onClick={this.saveTag}
          label='Save'
          secondary={true}
          buttonStyle={{bottom: '10px'}}
          style={{marginLeft: '25px', boxShadow: null, backgroundColor: null}}
        />
      );
    }

    return null;
  }

  renderDeletePrompt() {
    if (this.state.showDeletePrompt) {
      return (
        <span>
          Are you sure you want to delete? Click again to delete.
          <RaisedButton
            label='Confirm'
            secondary={true}
            style={{marginLeft: '15px'}}
            onClick={this.deleteTag}
          />
          <RaisedButton
            label='Cancel'
            primary={true}
            onClick={this.cancelDelete}
            style={{marginLeft: '15px'}}
          />
        </span>
      );
    }

    return null;
  }

  render() {
    const nestedTags = (this.props.nestedTags.children || []).map((tag, index) => {
      return (
        <Tag
          key={tag.id || tag.fakeId}
          nestedTags={tag}
          deleteTag={this.props.deleteTag}
          insertNewTag={this.props.insertNewTag}
          tagFakeIdCounter={this.props.tagFakeIdCounter}
          createTagMutation={this.props.createTagMutation}
          updateTagMutation={this.props.updateTagMutation}
          deleteTagMutation={this.props.deleteTagMutation}
          addSaveTag={this.props.addSaveTag}
          isSuperUser={this.props.isSuperUser}
          expandTag={this.state.expandTag}
        />
      );
    });

    const underLineStyle = { borderColor: null };

    const floatingLabelStyle = { color: null };

    if (this.props.nestedTags.isCategory) {
      underLineStyle.borderColor = purple300;
    }

    if (this.state.hasBeenEdited) {
      floatingLabelStyle.color = orange300;
    }

    let arrow = null;

    if (!this.state.expandTag && this.state.tag.children) {
      arrow = (
        <ArrowDown
          style={{marginLeft: '24px', cursor: 'pointer'}}
          onClick={this.expandTag}
        />
      );
    } else if (this.state.tag.children) {
      arrow = (
        <ArrowUp
          style={{marginLeft: '24px', cursor: 'pointer'}}
          onClick={this.expandTag}
        />
      );
    }

    if (this.state.tag && (this.state.tag.children || this.props.expandTag)) {
      return (
        <TagDiv key={this.props.nestedTags.id}>
          <Checkbox
            disabled={!this.props.isSuperUser}
            checked={!!this.state.tag.isCategory}
            style={{display: 'inline-block', width: '50px'}}
            onCheck={(e) => this.handleTagChange(e, 'isCategory')}
          />
          <TextField
            name='Tag Name'
            floatingLabelText='Tag Name'
            disabled={!this.props.isSuperUser}
            underlineStyle={underLineStyle}
            floatingLabelStyle={floatingLabelStyle}
            style={{ width: '200px'}}
            type='text'
            value={this.state.tag.name || ''}
            onChange={(e) => this.handleTagChange(e, 'name')}
          />
          <TextField
            name='Tag Slug'
            floatingLabelText='Tag Slug'
            disabled={!this.props.isSuperUser}
            underlineStyle={underLineStyle}
            floatingLabelStyle={floatingLabelStyle}
            style={{marginLeft: '50px', width: '100px'}}
            type='text'
            value={this.state.tag.slug || ''}
            onChange={(e) => this.handleTagChange(e, 'slug')}
          />
          <TextField
            name='Tag Description'
            floatingLabelText='Tag Description'
            disabled={!this.props.isSuperUser}
            underlineStyle={underLineStyle}
            type='text'
            floatingLabelStyle={floatingLabelStyle}
            style={{marginLeft: '50px', width: '300px'}}
            value={this.state.tag.description || ''}
            onChange={(e) => this.handleTagChange(e, 'description')}
          />
          {this.props.isSuperUser ? this.renderAddButton() : null}
          {this.props.isSuperUser ? this.renderDeleteButton() : null}
          {this.props.isSuperUser ? this.renderDeletePrompt() : null}
          {this.props.isSuperUser ? this.renderSaveButton() : null}
          <span style={{marginLeft: '10px'}}>{this.state.statusMessage}</span>
          {arrow}
          {nestedTags}
        </TagDiv>
      );
    }

    return null;
  }
}

export default Tag;
