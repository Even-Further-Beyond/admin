import gql from 'graphql-tag';

const QUERY_CHARACTERS = gql`
  query characters($offset: Int, $limit: Int) {
    characters(offset: $offset, limit: $limit) {
      id
      malId
      name
      alternativeNames
      ageStart
      ageEnd
      heightStart
      heightEnd
      weightStart
      weightEnd
      gender {
        id
        description
      }
      hairLength {
        id
        description
      }
      ageGroups {
        id
        name
      }
      hairColors {
        id
        name
      }
      eyeColors {
        id
        name
      }
      tags {
        id
        name
        description
      }
      updatedAt
      image {
        imagePath
      }
    }
  }
`;

export default QUERY_CHARACTERS;
