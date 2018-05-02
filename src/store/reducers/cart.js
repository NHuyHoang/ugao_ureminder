import { ADD_TO_CART, REMOVE_FROM_CART } from '../actions/ActionTypes'
const initialState = []

export default reducer = (state = initialState, action) => {
    switch (action.type) {
        case (ADD_TO_CART): {
            let exist = false;
            if (state.some(product => product._id === action.product._id))
                return state;
            let newState = [...state];
            action.product.quantity = 1;
            newState.push(action.product);
            return newState;
        }
        case (REMOVE_FROM_CART): {
            let newState = [...state];
            console.log(action._id);
            newState = newState.filter((item) => item._id != action._id)
            return newState;
        }
    }
    return state;
}