import { GET_CUSTOMER_FAILED, SAVE_LOCAL_CUSTOMER, LOG_OUT, SAVE_NEAREST_STORE, ADD_INVOICE } from '../actions/ActionTypes'
const initialState = {
    info: {
        _id: null,
        name: null,
        phone: null,
        email: null,
        img: null,
        location: null,
        invoices: []
    },
    store: {
        _id: null,
        name: null,
        owner: null,
        location: null,
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
        case (LOG_OUT):
            {
                return {
                    ...state,
                    info: { ...initialState.info }
                }
            }
        case (SAVE_NEAREST_STORE): {
            return {
                ...state,
                store: action.store,
            }
        }
        case (ADD_INVOICE): {
            const invoices = [...state.info.invoices];
            invoices.push(action.invoice);
            return {
                ...state,
                info: {
                    ...state.info,
                    invoices,
                }
            }
        }
        default: return state;
    }

}

export default reducer;