import { graphql } from 'react-apollo';
import { connect } from 'react-redux';

import { actions } from '../reducers/auth';
import QUERY_TRAITS_AND_TAGS from '../queries/traitsAndTags';
import CharacterDataEntry from '../components/CharacterDataEntry';

import RootState from '../types/RootState';
import { Response, InputProps } from '../types/response/CharacterDataEntry';

const mapStateToProps = (state: RootState) => ({
  isSuperUser: actions.isSuperUser(state),
});

const CharacterDataEntryWithTraitsAndTags = graphql<Response, InputProps>(QUERY_TRAITS_AND_TAGS, {
  options: { variables: { excludeCategories: true } },
})(CharacterDataEntry);

export default connect(mapStateToProps, null)(CharacterDataEntryWithTraitsAndTags);
