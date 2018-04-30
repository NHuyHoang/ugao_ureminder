import { GET_CUSTOMER_FAILED, SAVE_LOCAL_CUSTOMER } from '../actions/ActionTypes'
const initialState = {
    info: {
        _id: null,
        name: null,
        phone: null,
        email: null,
        img: null,
        location: null
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case (GET_CUSTOMER_FAILED):
            return state
        case (SAVE_LOCAL_CUSTOMER):
            {
                return {
                    ...state,
                    info: action.customer
                }
            }
        default: return state;
    }

}

export default reducer;