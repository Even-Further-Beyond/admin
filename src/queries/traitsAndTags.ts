import gql from 'graphql-tag';

const QUERY_TRAITS_AND_TAGS = gql`
  query traitsAndTags($excludeCategories: Boolean) {
    totalCharactersCount
    characterTraits {
      colors {
        id
        name
      }
      genders {
        id
        description
      }
      hairLengths {
        id
        description
      }
      ageGroups {
        id
        name
      }
    }
    tags(excludeCategories: $excludeCategories) {
      id
      name
      description
    }
  }
`;

export default QUERY_TRAITS_AND_TAGS;
