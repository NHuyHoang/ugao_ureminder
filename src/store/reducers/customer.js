import { GET_CUSTOMER } from '../actions/ActionTypes'
const initialState = {
    customer: {
        name: '',
        phone: ''
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case (GET_CUSTOMER): {
            return {
                ...state,
                ...action.customer
            }
        }
        default: return state;
    }

}

export default reducer;