import { GET_CUSTOMER } from './ActionTypes';

const getCustomer = () => {
    return {
        type: GET_CUSTOMER,
        customer: {
            phone: '123',
            name: 'huyhoang'
        }
    }
}

export const tryGetCustomer = () => {
    return dispatch => {
        dispatch(getCustomer());
    }
}