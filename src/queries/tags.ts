import gql from 'graphql-tag';

export const QUERY_TAGS = gql`
  query tags($excludeCategories: Boolean) {
    tags(excludeCategories: $excludeCategories) {
      id
      name
      description
    }
  }
`;

export const QUERY_ALL_TAGS = gql`
  query getAllTags {
    tags {
      id
      name
      description
      isCategory
      parentId
      slug
    }
  }
`;
