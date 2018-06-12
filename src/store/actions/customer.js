import { GET_CUSTOMER_FAILED, SAVE_LOCAL_CUSTOMER, LOG_OUT, SAVE_NEAREST_STORE, ADD_INVOICE, SHOW_NOTI, SET_SUBSCRIPTION_ORDER } from './ActionTypes';
import { AsyncStorage } from 'react-native';
import _ from 'lodash';
import globalConst from '../constant';
import { cartRemoveAll } from "./cart";

import FCM, { scheduleLocalNotification } from 'react-native-fcm';

//const GMAP_API_KEY = "AIzaSyDNW4hwd3ZpDzQRDQsK5Da2I-GMllqvh2s";
const itemKey = {
    customerKey: "get:info:customer",
    storeKey: "get:info:store",
    notiKey: "get:noti",
    subscriptionOrder: "get:subscription:order",
    subscriptionInterval: "get:subscription:interval"
}

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

const setSubscriptionOrder = (invoice) => {
    return {
        type: SET_SUBSCRIPTION_ORDER,
        invoice,
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
        let subscriptionOrderData = await AsyncStorage.getItem(itemKey.subscriptionOrder);
        if (!data) dispatch(getCustomerFailed());
        else {
            let customer = JSON.parse(data);
            let store = JSON.parse(storeData);
            let subscriptionOrder = JSON.parse(subscriptionOrderData);
            dispatch(saveLocalCustomer(customer));
            dispatch(saveNearestStore(store));
            dispatch(showNoti(showNotiValue == "true"));
            dispatch(setSubscriptionOrder(subscriptionOrder));
        }
    }
}

export const OAuthCustomerLogin = (customer, done) => {
    return async dispatch => {
        dispatch(trySaveLocalCustomer(customer))
            .then( _ => done())
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

export const tryRegisterCustomer = (info, callback) => {
    //info = {email,name,img}
    let { email, name, img } = info;
    console.log(img);
    return async dispatch => {
        //get,set FCM token
        const tokenPromise = new Promise((resolve, reject) => {
            FCM.getFCMToken().then(token => {
                AsyncStorage.setItem("FCM:token", token);
                resolve(token);
            }).catch(err => {
                console.log(err);
                reject(null)
            })
        })
        //use this user's current location
        const locationPromise = new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(pos => {
                let { latitude, longitude } = pos.coords;
                //try find the address name by coordinate
                fetch("https://maps.googleapis.com/maps/api/geocode/json?"
                    + `latlng=${latitude},${longitude}&key=${globalConst.GMAP_API_KEY}`)
                    .then(data => data.json())
                    .then(data => data.results[0].formatted_address)
                    .then(address => resolve({
                        address,
                        lat: latitude,
                        lng: longitude
                    }))
                    .catch(err => {
                        console.log(err);
                        reject({
                            address: "",
                            lat: latitude,
                            lng: longitude
                        })
                    });
            }, err => {
                console.log(err);
                reject({
                    address: "",
                    lat: null,
                    lng: null
                })
            }, { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 })
        })
        const assembledPromise = await Promise.all([tokenPromise, locationPromise])
            .then(value => value);

        console.log(assembledPromise);
        const token = assembledPromise[0];
        const location = assembledPromise[1];
        //query to the server
        const body = {
            query: `mutation addCustomer($email: String!, $name: String!, $location: JSON,$token:String,$img:String) {
                    addCustomer(email:$email, name:$name, location:$location,token:$token, img:$img){ 
                        _id token email name pass img phone 
                        location { address lat lng }
                        invoices { _id }
                    }
                }`,
            variables: {
                email,
                name,
                img,
                token,
                location
            }
        }
        try {
            let response = await fetch(globalConst.DB_URI, {
                body: JSON.stringify(body),
                headers: {
                    'content-type': 'application/json'
                },
                method: 'POST',
            }).then(res => res.json());
            //call trySaveLocalCustomer
            dispatch(trySaveLocalCustomer(response.data.addCustomer))
                .then(_ => callback(true))
        } catch (err) {
            console.log(err);
            callback(false);
        }

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
        console.log(distanceMatrix);
    } catch (err) {
        console.log(err);
    }

    //get the smallest duration travel time
    //from user location to store location

    //this case only appear when using emulator
    //because its current location is "1599 Amphitheatre Pkwy, Mountain View, CA 94043, USA"
    //which mean cannot calculate the direction
    if (distanceMatrix[0].status === "ZERO_RESULTS") return null;

    const minDuration = Math.min(...distanceMatrix.map(e => e.duration.value));
    const index = distanceMatrix.findIndex(e => e.duration.value === minDuration);

    return stores[index];
}


const trySubscriptOrder = (date, invoice) => {
    return async (dispatch) => {
        //save to AsyncStorage
        AsyncStorage.setItem(itemKey.subscriptionOrder, JSON.stringify(invoice));
        //save to redux store
        dispatch(setSubscriptionOrder(invoice));
        //set the schedule local notification
        dispatch(setupScheduleLocalNoti(date));
    }
}

//make an order
//the callback will return boolean whether this process success or not
export const tryMakeOrder = (callback, preparedInvoice, subscriptionDate) => {
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
        console.log(body);
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
            console.log(err);
            return;

        }
        console.log(response);

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
            savedCustomer.invoices.unshift(saveInvoice);
            AsyncStorage.setItem(itemKey.customerKey, JSON.stringify(savedCustomer));
            //if customer set this invoice is the supscription invoice
            //we will save this invoice and make notify customer
            if (subscriptionDate) {
                dispatch(trySubscriptOrder(subscriptionDate, saveInvoice));
                AsyncStorage.setItem(itemKey.subscriptionInterval, subscriptionDate.toString())
            }
            //if order by the reminder screen
            //we will re-schedule the local schedule notification 
            if (preparedInvoice) {
                let date = await AsyncStorage.getItem(itemKey.subscriptionInterval);
                if (date) dispatch(setupScheduleLocalNoti(parseInt(date)));
            }
            dispatch(addInvoice(saveInvoice));
            dispatch(cartRemoveAll());
            //dispatch(setupScheduleLocalNoti());
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

const setupScheduleLocalNoti = (date) => {
    return (dispatch, getState) => {
        if (!date) return;
        const invoices = [...getState().customer.info.invoices];
        if (getState().customer.showNoti) {
            FCM.scheduleLocalNotification({
                id: 'testnotif',
                opened_from_tray: 1,
                title: "UReminder",
                //fire_date: new Date().getTime() + calculateOrderDate(invoices),
                fire_date: new Date().getTime() + date * 24 * 60 * 60 * 1000,
                //fire_date: new Date().getTime() + 5000,
                vibrate: 300,
                body: 'Gạo của bạn sắp hết',
                priority: "high",
                large_icon: "ic_launcher",
                icon: "ic_launcher",
                show_in_foreground: false,
                targetScreen: "Reminder"
            });
            // console.log(new Date().getTime() + date * 24 * 60 * 60 * 1000);
        }
    }
}

export const tryUpdateCustomerInfo = (info, callback) => {
    return async (dispatch, getState) => {
        let savedCustomer = {
            ...getState().customer.info
        };

        const newCustomerInfo = {
            //address should put into location:{address:"new address",... }
            //so just omit this property and add later
            _id: savedCustomer._id,
            ..._.omit(info, ['address'])
        }
        //if customer only update his/her coordinate
        if (info.coordinate) {
            newCustomerInfo.location = {
                //...savedCustomer.location,
                address: info.coordinate.address,
                lat: info.coordinate.lat,
                lng: info.coordinate.lng,
            }
            console.log(newCustomerInfo.location)
        } else {
            newCustomerInfo.location = {
                ...savedCustomer.location,
                address: info.address,
            }

        }

        savedCustomer = {
            ...savedCustomer,
            ..._.omit(newCustomerInfo, ['coordinate'])
        }

        const body = {
            query: `
                mutation updateCustomer($updateInfo:JSON!){
                    updateCustomer(updateInfo:$updateInfo)
                }`,
            variables: {
                updateInfo: {
                    ...newCustomerInfo
                }
            }
        }
        console.log(body);
        let success;
        try {
            const response = await fetch(globalConst.DB_URI, {
                body: JSON.stringify(body),
                headers: {
                    'content-type': 'application/json'
                },
                method: 'POST',
            }).then(res => res.json());
            //console.log(response);
            success = response.data.updateCustomer.success;
            if (success) {
                AsyncStorage.setItem(itemKey.customerKey, JSON.stringify(savedCustomer));
                await dispatch(saveLocalCustomer(savedCustomer));
                //customer update his/her location
                //try to find another nearest store
                if (info.coordinate) {

                    let store = await tryFindNearestStore(newCustomerInfo.location);
                    console.log(store);
                    AsyncStorage.setItem(itemKey.storeKey, JSON.stringify(store))
                    dispatch(saveNearestStore(store));
                }
                callback(true);
            }
            else {
                callback(false);
                return;
            }
        } catch (err) {
            callback(false);
            return;
        }

    }
}

