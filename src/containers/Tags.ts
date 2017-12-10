import { graphql } from 'react-apollo';

import { Response, InputProps } from '../types/response/Tags';
import { QUERY_ALL_TAGS } from '../queries/tags';
import Tags from '../components/TagEditor/Tags';

const TagsWithData = graphql<Response, InputProps>(QUERY_ALL_TAGS, {
  options: ({ createTagMutation, updateTagMutation, deleteTagMutation, isSuperUser }) => ({
    variables: { createTagMutation, updateTagMutation, deleteTagMutation, isSuperUser },
  }),
})(Tags);

export default TagsWithData;
