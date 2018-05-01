import { SAVE_PRODUCTS } from '../actions/ActionTypes';
const initialState = null


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case (SAVE_PRODUCTS): {
            return [...action.products]

        }
    }
    return state;
}

export default reducer;