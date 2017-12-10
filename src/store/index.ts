import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

import reducers from '../reducers';
import GraphQLClient from '../GraphQLClient';

const middlewares = [thunk];
middlewares.push((GraphQLClient as any).middleware());

if (process.env.NODE_ENV !== 'production') {
  const logger = createLogger();
  middlewares.push((logger as any));
}

/* eslint-disable no-underscore-dangle */
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(reducers, {}, composeEnhancers(applyMiddleware(...middlewares)));
