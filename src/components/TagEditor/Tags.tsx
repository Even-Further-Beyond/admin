import * as React from 'react';
import { ChildProps } from 'react-apollo';

import CircularProgress from 'material-ui/CircularProgress';

import * as types from '../../types/data';
import Tag from './Tag';
import { Response, InputProps } from '../../types/response/Tags';

interface State {
  tagDeletions: string[];
  tagFakeIdCounter: number;
  tagFakeIdDeletions: number[];
  nestedTags?: any;
}

class Tags extends React.Component<ChildProps<InputProps, Response>, State> {
  constructor(props: ChildProps<InputProps, Response>) {
    super(props);

    this.state = {
      tagDeletions: [],
      tagFakeIdCounter: 5000,
      tagFakeIdDeletions: [],
      nestedTags: null,
    };
  }

  componentWillReceiveProps(nextProps: ChildProps<InputProps, Response>) {
    if (nextProps.data.tags) {
      const nestedTags = this.nestTags(nextProps.data.tags);
      this.setState({ nestedTags });
    }
  }

  insertNewTag = (tagFakeIdCounter: number) => {
    this.setState({ tagFakeIdCounter });
  }

  addSaveTag = (fakeId: number, tag: types.Tag) => {
    const nestedTags = this.state.nestedTags;
    this.updateObjectById(nestedTags, fakeId, tag);
    this.setState({ nestedTags });
  }

  deleteTag = (tag: types.Tag) => {
    const tagDeletions = this.state.tagDeletions;
    const tagFakeIdDeletions = this.state.tagFakeIdDeletions;

    if (!tagDeletions.includes(tag.id) && tag.id) {
      tagDeletions.push(tag.id);
    }

    if (!tagFakeIdDeletions.includes(tag.fakeId) && tag.fakeId) {
      tagFakeIdDeletions.push(tag.fakeId);
    }

    this.setState({
      tagDeletions,
      tagFakeIdDeletions,
    });
  }

  nestTags(tags: types.Tag[]) {
    const tagMap = {};
    const clonedTags = JSON.parse(JSON.stringify(tags));

    clonedTags.forEach((tag) => tagMap[tag.id] = tag);

    clonedTags.forEach((tag) => {
      if (tag.parentId !== null) {
        const parent = tagMap[tag.parentId];
        (parent.children = parent.children || []).push(tag);
      }
    });

    return clonedTags.filter((tag) => {
      return tag.parentId === null;
    });
  }

  updateObjectById(object: any, fakeId: number, tag: types.Tag) {
    if (!object) {
      return;
    }

    if (object.fakeId === fakeId) {
      object.id = tag.id;
      object.fakeId = null;
    } else if ((typeof(object) === 'object') && (object.constructor === Array)) {
      for (let i = 0; i < object.length; i++) {
        this.updateObjectById(object[i], fakeId, tag);
      }
    } else if (object.children) {
      this.updateObjectById(object.children, fakeId, tag);
    }
  }

  render() {
    const { loading, error } = this.props.data;

    if (loading) {
      return <CircularProgress size={160} thickness={5} />;
    }

    if (error) {
      return <span>Error loading tags</span>;
    }

    const self = this;

    let nestedTags = null;

    if (this.state.nestedTags) {
      nestedTags = this.state.nestedTags;
    } else {
      return null;
    }

    if (this.state.tagDeletions.length || this.state.tagFakeIdDeletions.length) {
      nestedTags = nestedTags.filter(function f(tag: types.Tag) {
        if (tag.children && tag.children.length) {
          return (tag.children = tag.children.filter(f));
        }

        if (!self.state.tagDeletions.includes(tag.id) && !self.state.tagFakeIdDeletions.includes(tag.fakeId)) {
          return true;
        }
      });
    }

    return (
      <Tag
        nestedTags={nestedTags[0]}
        deleteTag={this.deleteTag}
        insertNewTag={this.insertNewTag}
        tagFakeIdCounter={this.state.tagFakeIdCounter}
        createTagMutation={this.props.createTagMutation}
        updateTagMutation={this.props.updateTagMutation}
        deleteTagMutation={this.props.deleteTagMutation}
        addSaveTag={this.addSaveTag}
        isSuperUser={this.props.isSuperUser}
      />
    );
  }
}

export default Tags;
