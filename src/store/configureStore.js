import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { CutomerReducer } from './reducers';
import { ApolloClient, createNetworkInterface } from 'react-apollo';
import thunk from 'redux-thunk';

//this setting is used redux v3.7.2

//setup graphQL api uri
const networkInterface = createNetworkInterface({
    uri: 'https://gentle-dawn-11577.herokuapp.com/graphql'
});

export const client = new ApolloClient({
    networkInterface: networkInterface
});


const rootReducer = combineReducers({
    customer: CutomerReducer,
    apollo: client.reducer(),
})

let composeEnhancers = compose;

if (__DEV__) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

console.log(rootReducer)


export const store = createStore(
    rootReducer, composeEnhancers(applyMiddleware(thunk))
);


