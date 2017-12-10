import { gql } from 'react-apollo';

export const MUTATION_CREATE_TAG = gql`
  mutation createTag($tag: TagInput!) {
    createTag(tag: $tag) {
      id
      name
      description
      slug
    }
  }
`;

export const MUTATION_UPDATE_TAG = gql`
  mutation updateTag($tag: TagInput!) {
    updateTag(tag: $tag) {
      id
      name
      description
      slug
    }
  }
`;

export const MUTATION_DELETE_TAG = gql`
  mutation deleteTag($tagId: ID!) {
    deleteTag(tagId: $tagId) {
      id
      name
    }
  }
`;
