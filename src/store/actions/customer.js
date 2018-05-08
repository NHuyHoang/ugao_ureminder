import { GET_CUSTOMER_FAILED, SAVE_LOCAL_CUSTOMER, LOG_OUT, SAVE_NEAREST_STORE } from './ActionTypes';
import { AsyncStorage } from 'react-native'

const GMAP_API_KEY = "AIzaSyDNW4hwd3ZpDzQRDQsK5Da2I-GMllqvh2s";
const itemKey = { customerKey: "get:info:customer", storeKey: "get:info:store" }

const getCustomerFailed = () => {
    console.log('invoke');
    return {
        type: GET_CUSTOMER_FAILED
    }
}

const saveLocalCustomer = (customer) => {
    return {
        type: SAVE_LOCAL_CUSTOMER,
        customer
    }
}

const saveNearestStore = (store) => {
    return {
        type: SAVE_NEAREST_STORE,
        store,
    }
}

export const logout = () => {
    AsyncStorage.removeItem(itemKey.customerKey);
    return {
        type: LOG_OUT
    }
}

export const tryGetLocalCustomer = () => {
    return async dispatch => {
        //AsyncStorage.removeItem(itemKey.customerKey);
        let data = await AsyncStorage.getItem(itemKey.customerKey);
        let storeData = await AsyncStorage.getItem(itemKey.storeKey);
        if (!data) dispatch(getCustomerFailed());
        else {
            let customer = JSON.parse(data);
            let store = JSON.parse(storeData);
            dispatch(saveLocalCustomer(customer));
            dispatch(saveNearestStore(store));
        }
    }
}

export const trySaveLocalCustomer = (customer) => {
    return async dispatch => {
        AsyncStorage.setItem(itemKey.customerKey, JSON.stringify(customer))
        dispatch(saveLocalCustomer(customer));
        let store = await tryFindNearestStore(customer.location);
        AsyncStorage.setItem(itemKey.storeKey, JSON.stringify(store))
        dispatch(saveNearestStore(store));
    }
}

//get all store and find the nearest one using google map distancematrix api
const tryFindNearestStore = async (location) => {
    let uri = `https://gentle-dawn-11577.herokuapp.com/graphql?query=
    { stores { _id  owner{ email  name  phone }  name  location { address lat lng }  } }`
    let stores;
    try {
        //get all store's info
        stores = await fetch(uri)
            .then(data => data.json())
            .then(result => result.data.stores)
    } catch (err) {
        console.log(err);
    }
    if (!stores) return;
    let destinations = "";

    //concat store coordinate
    stores.forEach(store => {
        destinations += `${store.location.lat},${store.location.lng}|`
    });

    uri = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${location.lat},${location.lng}&destinations=${destinations}&key=${GMAP_API_KEY}`;
    let distanceMatrix;
    try {
        distanceMatrix = await fetch(uri)
            .then(data => data.json())
            .then(data => data.rows[0].elements);
    } catch (err) {
        console.log(err);
    }

    //get the smallest duration travel time
    //from user location to store location

    const minDuration = Math.min(...distanceMatrix.map(e => e.duration.value));
    const index = distanceMatrix.findIndex(e => e.duration.value === minDuration);

    return stores[index];
}