import { ADD_TO_CART, REMOVE_FROM_CART, SUB_ONE_PRODUCT, ADD_ONE_PRODUCT, CART_REMOVE_ALL } from '../actions/ActionTypes'
const initialState = {
    products: [],
    totalPrice: 0
}

export default reducer = (state = initialState, action) => {
    switch (action.type) {
        case (ADD_TO_CART): {
            let exist = false;
            if (state.products.some(product => product._id === action.product._id))
                return state;
            let productsCloned = [...state.products];
            action.product.quantity = 1;
            productsCloned.push(action.product);
            return {
                ...state,
                products: productsCloned,
                totalPrice: state.totalPrice += action.product.price
            };
        }
        case (REMOVE_FROM_CART): {
            let removedProduct = state.products.find((item) => item._id === action._id);
            let productsCloned = state.products.filter((item) => item._id != action._id);
            console.log(productsCloned);
            return {
                ...state,
                products: productsCloned,
                totalPrice: state.totalPrice -= (removedProduct.price * removedProduct.quantity)
            };
        }
        case (CART_REMOVE_ALL): {
            return initialState
        }
        case (SUB_ONE_PRODUCT): {
            let product = state.products.find(e => e._id === action._id);
            --product.quantity;
            return {
                ...state,
                totalPrice: state.totalPrice -= product.price
            };
        }
        case (ADD_ONE_PRODUCT): {
            let product = state.products.find(e => e._id === action._id);
            ++product.quantity;
            return {
                ...state,
                totalPrice: state.totalPrice += product.price
            };
        }

    }
    return state;
}