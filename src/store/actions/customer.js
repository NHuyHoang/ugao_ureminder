import { GET_CUSTOMER_FAILED, SAVE_LOCAL_CUSTOMER, LOG_OUT } from './ActionTypes';
import { AsyncStorage } from 'react-native'

const itemKey = { customerKey: "get:info:customer" }

const getCustomer = () => {
    return {
        type: GET_LOCAL_CUSTOMER,
        customer: {
            phone: '123',
            name: 'huyhoang'
        }
    }
}

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

export const logout = () => {
    AsyncStorage.removeItem(itemKey.customerKey);
    return {
        type: LOG_OUT
    }
}

export const tryGetLocalCustomer = () => {
    return dispatch => {
        //AsyncStorage.removeItem(itemKey.customerKey);
        AsyncStorage.getItem(itemKey.customerKey)
            .then(data => {
                if (!data) dispatch(getCustomerFailed());
                else {
                    let customer = JSON.parse(data);
                    dispatch(saveLocalCustomer(customer))
                }
            })
            .catch(err => console.log(err))
    }
}

export const trySaveLocalCustomer = (customer) => {
    return dispatch => {
        AsyncStorage.setItem(itemKey.customerKey, JSON.stringify(customer))
            .then(data => {

                console.log(data)
            });
        dispatch(saveLocalCustomer(customer));
        /*  AsyncStorage.getItem(itemKey.customerKey)
             .then(data => {
                 console.log(data)
             }) */
    }
}
