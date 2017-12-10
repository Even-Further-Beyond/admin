import * as React from 'react';

import Tags from '../../containers/Tags';

interface InputProps {
  isSuperUser: boolean;
}

interface Props extends InputProps {
  createTagMutation: ({}: {}) => Promise<{data: any}>;
  updateTagMutation: ({}: {}) => Promise<{data: any}>;
  deleteTagMutation: ({}: {}) => Promise<{data: any}>;
}

class TagEditor extends React.Component<Props, {}> {
  render() {
    return (
      <div>
        <Tags
          createTagMutation={this.props.createTagMutation}
          updateTagMutation={this.props.updateTagMutation}
          deleteTagMutation={this.props.deleteTagMutation}
          isSuperUser={this.props.isSuperUser}
        />
      </div>
    );
  }
}

export default TagEditor;
