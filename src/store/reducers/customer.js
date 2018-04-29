import { GET_CUSTOMER_FAILED, SAVE_LOCAL_CUSTOMER } from '../actions/ActionTypes'
const initialState = {
    customer: {
        name: '',
        phone: ''
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
                    customer: action.customer
                }
            }
        default: return state;
    }

}

export default reducer;