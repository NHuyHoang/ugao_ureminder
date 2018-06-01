import { GET_CUSTOMER_FAILED, SAVE_LOCAL_CUSTOMER, LOG_OUT, SAVE_NEAREST_STORE, ADD_INVOICE, SHOW_NOTI, SET_SUBSCRIPTION_ORDER } from '../actions/ActionTypes'
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
    },
    showNoti: true,
    subscriptionOrder: null
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
            invoices.unshift(action.invoice);
            return {
                ...state,
                info: {
                    ...state.info,
                    invoices,
                }
            }
        }
        case (SHOW_NOTI): {
            return {
                ...state,
                showNoti: action.showNoti
            }
        }
        case (SET_SUBSCRIPTION_ORDER): {
            return {
                ...state,
                subscriptionOrder: action.invoice
            }
        }
        default: return state;
    }

}

export default reducer;