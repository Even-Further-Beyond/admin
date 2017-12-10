import gql from 'graphql-tag';

const QUERY_CHARACTER_TRAITS = gql`
  query characterTraits {
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
  }
`;

export default QUERY_CHARACTER_TRAITS;
