import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';

import RootState from '../types/RootState';
import { MUTATION_CREATE_TAG, MUTATION_UPDATE_TAG, MUTATION_DELETE_TAG } from '../mutations/tags';
import { actions } from '../reducers/auth';
import TagEditor from '../components/TagEditor';

interface InputProps {
  isSuperUser: boolean;
}

interface Props extends InputProps {
  createTagMutation: ({}: {}) => Promise<{data: any}>;
  updateTagMutation: ({}: {}) => Promise<{data: any}>;
  deleteTagMutation: ({}: {}) => Promise<{data: any}>;
}

const mapStateToProps = (state: RootState) => ({
  isSuperUser: actions.isSuperUser(state),
});

export default compose(
  graphql<void, Props>(MUTATION_CREATE_TAG, {
    name: 'createTagMutation',
    options: {
      refetchQueries: [
        'tagsQuery',
      ],
    },
  }),
  graphql<void, Props>(MUTATION_UPDATE_TAG, {
    name: 'updateTagMutation',
    options: {
      refetchQueries: [
        'tagsQuery',
      ],
    },
  }),
  graphql<void, Props>(MUTATION_DELETE_TAG, {
    name: 'deleteTagMutation',
    options: {
      refetchQueries: [
        'tagsQuery',
      ],
    },
  }),
  connect(mapStateToProps, null),
)(TagEditor);
