import { ApolloClient, createNetworkInterface } from 'react-apollo';

const networkInterface = createNetworkInterface({
  uri: `${process.env.REACT_APP_API_URL}/graphql`,
});

networkInterface.use([{
  applyMiddleware(req: any, next: () => void) {
    if (!req.options.headers) {
      req.options.headers = {};
    }

    const token = localStorage.getItem('id_token');
    req.options.headers.authorization = token ? `Bearer ${token}` : null;
    next();
  },
}]);

const GraphQLClient = new ApolloClient({ networkInterface });

export default GraphQLClient;
