import gql from 'graphql-tag';

const QUERY_TOTAL_CHARACTERS_COUNT = gql`
  query totalCharactersCount {
    totalCharactersCount
  }
`;

export default QUERY_TOTAL_CHARACTERS_COUNT;
