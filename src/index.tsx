import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { injectGlobal } from 'styled-components';

import styles from './styles';
import store from './store';
import GraphQLClient from './GraphQLClient';
import registerServiceWorker from './registerServiceWorker';
import App from './App';

// tslint:disable-next-line:no-unused-expression
injectGlobal`
  body {
    margin: 0;
    font-family: ${styles.fontFamily};
    background-color: ${styles.primaryBackgroundColor};
    color: ${styles.primaryTextColor};
  }
`;

if (process.env.NODE_ENV !== 'production') {
  (window as any).store = store;
}

ReactDOM.render(
    <ApolloProvider store={store} client={GraphQLClient}>
      <BrowserRouter>
        <Route component={App} />
      </BrowserRouter>
    </ApolloProvider>,
  document.getElementById('root'),
);
registerServiceWorker();
