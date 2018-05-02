import { ADD_TO_CART, REMOVE_FROM_CART } from '../actions/ActionTypes';

export const addToCart = (product) => {
    return {
        type: ADD_TO_CART,
        product,
    }
}

export const removeFromCart = (_id) => {
    return {
        type: REMOVE_FROM_CART,
        _id,
    }
}