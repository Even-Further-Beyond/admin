import { gql } from 'react-apollo';

const MUTATION_UPDATE_CHARACTER = gql`
  mutation updateCharacter($character: CharacterInput!) {
    updateCharacter(character: $character) {
      id
      name
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
      }
      updatedAt
      createdAt
    }
  }
`;

export default MUTATION_UPDATE_CHARACTER;
