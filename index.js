import { AppRegistry } from 'react-native';
import { ApolloClient, createNetworkInterface, ApolloProvider } from 'react-apollo';
import React from 'react';
import App from './App';

const networkInterface = createNetworkInterface({
    uri: 'https://gentle-dawn-11577.herokuapp.com/graphql'
});
const client = new ApolloClient({
    networkInterface: networkInterface
});

const ApolloApp = () => (
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
)

AppRegistry.registerComponent('ugao_ureminder', () => ApolloApp);
