import { combineReducers } from 'redux';

import GraphQLClient from '../GraphQLClient';
import auth from './auth';

const reducers = combineReducers({
  apollo: GraphQLClient.reducer(),
  auth,
});

export default reducers;
