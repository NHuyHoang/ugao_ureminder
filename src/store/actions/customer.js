import { GET_CUSTOMER_FAILED, SAVE_LOCAL_CUSTOMER, LOG_OUT, SAVE_NEAREST_STORE, ADD_INVOICE, SHOW_NOTI } from './ActionTypes';
import { AsyncStorage } from 'react-native';
import globalConst from '../constant';
import { cartRemoveAll } from "./cart";

import FCM, { scheduleLocalNotification } from 'react-native-fcm';

//const GMAP_API_KEY = "AIzaSyDNW4hwd3ZpDzQRDQsK5Da2I-GMllqvh2s";
const itemKey = { customerKey: "get:info:customer", storeKey: "get:info:store", notiKey: "get:noti" }

const getCustomerFailed = () => {
    console.log('invoke');
    return {
        type: GET_CUSTOMER_FAILED
    }
}

const saveLocalCustomer = (customer) => {
    return {
        type: SAVE_LOCAL_CUSTOMER,
        customer
    }
}

const saveNearestStore = (store) => {
    return {
        type: SAVE_NEAREST_STORE,
        store,
    }
}

const addInvoice = (invoice) => {
    return {
        type: ADD_INVOICE,
        invoice
    }
}

export const logout = () => {
    AsyncStorage.removeItem(itemKey.customerKey);
    return {
        type: LOG_OUT
    }
}

export const showNoti = (show) => {
    return {
        type: SHOW_NOTI,
        showNoti: show
    }
}

export const onTrySetShowNoti = (show) => {
    return dispatch => {
        AsyncStorage.setItem(itemKey.notiKey, show.toString());
        dispatch(showNoti(show))
    }
}

export const tryGetLocalCustomer = () => {
    return async dispatch => {
        //AsyncStorage.removeItem(itemKey.customerKey);
        let data = await AsyncStorage.getItem(itemKey.customerKey);
        let storeData = await AsyncStorage.getItem(itemKey.storeKey);
        let showNotiValue = await AsyncStorage.getItem(itemKey.notiKey);
        if (!data) dispatch(getCustomerFailed());
        else {
            let customer = JSON.parse(data);
            let store = JSON.parse(storeData);
            dispatch(saveLocalCustomer(customer));
            dispatch(saveNearestStore(store));
            dispatch(showNoti(showNotiValue == "true"));
        }
    }
}

export const trySaveLocalCustomer = (customer) => {
    return async dispatch => {
        AsyncStorage.setItem(itemKey.customerKey, JSON.stringify(customer))
        dispatch(saveLocalCustomer(customer));
        let store = await tryFindNearestStore(customer.location);
        AsyncStorage.setItem(itemKey.storeKey, JSON.stringify(store))
        dispatch(saveNearestStore(store));
    }
}

//get all store and find the nearest one using google map distancematrix api
const tryFindNearestStore = async (location) => {
    let uri = `${globalConst.DB_URI}?query=
    { stores { _id  owner{ email  name  phone }  name  location { address lat lng }  } }`
    let stores;
    try {
        //get all store's info
        stores = await fetch(uri)
            .then(data => data.json())
            .then(result => result.data.stores)
    } catch (err) {
        console.log(err);
    }
    if (!stores) return;
    let destinations = "";

    //concat store coordinate
    stores.forEach(store => {
        destinations += `${store.location.lat},${store.location.lng}|`
    });

    uri = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${location.lat},${location.lng}&destinations=${destinations}&key=${globalConst.GMAP_API_KEY}`;
    let distanceMatrix;
    try {
        distanceMatrix = await fetch(uri)
            .then(data => data.json())
            .then(data => data.rows[0].elements);
    } catch (err) {
        console.log(err);
    }

    //get the smallest duration travel time
    //from user location to store location

    const minDuration = Math.min(...distanceMatrix.map(e => e.duration.value));
    const index = distanceMatrix.findIndex(e => e.duration.value === minDuration);

    return stores[index];
}

//make an order
//the callback will return boolean whether this process success or not
export const tryMakeOrder = (callback, preparedInvoice) => {
    return async (dispatch, getState) => {
        const customer = getState().customer;
        const customerId = customer.info._id;
        const storeId = getState().customer.store._id
        let getProducts;
        //if the order was made by the reminder s
        //we would use the latest invoice

        if (preparedInvoice)
            getProducts = preparedInvoice.products;
        else getProducts = getState().cart.products;
        //prepare for products data ---> [{_id:1234,quantity:2}.....]
        const products = getProducts.map(product => ({
            _id: product._id,
            quantity: product.quantity
        }))

        let invoicePrice;
        if (preparedInvoice)
            invoicePrice = preparedInvoice.price;
        else invoicePrice = getState().cart.totalPrice;

        const invoice = {
            //because online payment function hasn't been implement yet
            //so only COD payment method is available
            paid: false,
            payment_method: "COD",
            order_date: new Date(),
            price: invoicePrice,
            tasks: {
                location: { ...customer.info.location },
                receipt_date: null,
            },
            products,
        }

        const body = {
            //the query for adding invoice
            query: "mutation addInvoice($invoice: JSON!, $customerId: String!, $storeId: String!) { addInvoice(invoice: $invoice, customerId: $customerId, storeId: $storeId) }",
            variables: {
                storeId,
                customerId,
                invoice,
            }
        }

        let response;
        try {
            response = await fetch(globalConst.DB_URI, {
                body: JSON.stringify(body),
                headers: {
                    'content-type': 'application/json'
                },
                method: 'POST',
            }).then(res => res.json());
        } catch (err) {
            callback(false)
            return;
            console.log(err)
        }

        //if successful add the new invoice
        if (response.data && response.data.addInvoice) {
            const rawCustomer = await AsyncStorage.getItem(itemKey.customerKey);
            const savedCustomer = JSON.parse(rawCustomer);

            //re-format the products
            const saveProducts = getProducts.map(product => ({
                product,
                quantity: product.quantity
            }));
            let saveInvoice = {
                ...invoice,
                _id: response.data.addInvoice._id,
                products: saveProducts,
                store: getState().customer.store
            }
            savedCustomer.invoices.push(saveInvoice);
            AsyncStorage.setItem(itemKey.customerKey, JSON.stringify(savedCustomer));
            dispatch(addInvoice(saveInvoice));
            dispatch(cartRemoveAll());
            dispatch(setupScheduleLocalNoti());
            callback(true);
        }
        else callback(false);
    }
}

const calculateOrderDate = (data) => {

    if (data.length < 2) return null;
    return new Date(data[data.length - 1].order_date).getTime() -
        new Date(data[data.length - 2].order_date).getTime();

}

const setupScheduleLocalNoti = () => {
    return (dispatch, getState) => {
        const invoices = [...getState().customer.info.invoices];
        console.log(calculateOrderDate(invoices));
        if (getState().customer.showNoti) {
            FCM.scheduleLocalNotification({
                id: 'testnotif',
                opened_from_tray: 1,
                title: "UReminder",
                fire_date: new Date().getTime() + calculateOrderDate(invoices),
                vibrate: 300,
                body: 'Gạo của bạn sắp hết',
                priority: "high",
                large_icon: "ic_launcher",
                icon: "ic_launcher",
                show_in_foreground: false,
                targetScreen: "Reminder"
            });
        }
    }
}



