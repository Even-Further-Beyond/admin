import { graphql } from 'react-apollo';

import { Response, InputProps } from '../types/response/Characters';
import QUERY_CHARACTERS from '../queries/characters';
import Characters from '../components/CharacterDataEntry/Characters';

const CharactersWithTraitsAndTags = graphql<Response, InputProps>(QUERY_CHARACTERS, {
  options: ({ offset, limit, characterTraits, tags, isSuperUser }) => ({
    variables: { offset, limit, characterTraits, tags, isSuperUser },
  }),
})(Characters);

export default CharactersWithTraitsAndTags;
