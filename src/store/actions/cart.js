import { ADD_TO_CART, REMOVE_FROM_CART, CART_REMOVE_ALL, ADD_ONE_PRODUCT, SUB_ONE_PRODUCT } from '../actions/ActionTypes';

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

const addOneProduct = (_id) => {
    return {
        type: ADD_ONE_PRODUCT,
        _id,
    }
}

export const cartRemoveAll = () => {
    return {
        type: CART_REMOVE_ALL
    }
}

const subOneProduct = (_id) => {
    return {
        type: SUB_ONE_PRODUCT,
        _id,
    }
}

export const productQuantityHandler = (_id, type) => {
    return (dispatch, getState) => {
        if (type === "add") {
            dispatch(addOneProduct(_id));
        }
        else if (type === "sub") {
            let products = getState().cart.products;
            let product = products.find(e => e._id === _id);
            if (!product) return;
            if (product.quantity === 1)
                dispatch(removeFromCart(_id));
            else
                dispatch(subOneProduct(_id));
        }
    }
}