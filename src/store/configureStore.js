import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import * as Reducers from './reducers';
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
    customer: Reducers.CutomerReducer,
    products: Reducers.ProductReducer,
    cart: Reducers.CartReducer,
    apollo: client.reducer(),
})

let composeEnhancers = compose;

if (__DEV__) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}



export const store = createStore(
    rootReducer, composeEnhancers(applyMiddleware(thunk))
);


