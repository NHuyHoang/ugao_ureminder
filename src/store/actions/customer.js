import { GET_CUSTOMER_FAILED, SAVE_LOCAL_CUSTOMER } from './ActionTypes';
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

export const tryGetLocalCustomer = () => {
    return dispatch => {
        console.log('dfsfsereeeeeeeeeeeeeeeeeeeeeee');
        AsyncStorage.getItem(itemKey.customerKey)
            .then(data => {
                console.log("dfdfdfs")
                if (!data) dispatch(getCustomerFailed());
                else {
                    let customer = JSON.parse(data);
                    dispatch(saveLocalCustomer(customer))
                }
            })
            .catch(err => console.log(err))
    }
}
