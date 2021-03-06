import React from 'react';
import {StyleSheet, Text, View, AsyncStorage} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {TabNavigator, TabBarBottom, StackNavigator} from 'react-navigation';
import {connect} from 'react-redux';
import FCM, {FCMEvent} from "react-native-fcm";
import * as Screens from './src/screens';
import ui from './src/share/ui.constant';
import {tryGetLocalCustomer, tryUpdateInvoiceStatus} from './src/store/actions';
import NavigationService from './NavigationService';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.props.tryGetLocalCustomer();
    }

    componentDidMount() {
        //this function check whether there is any notification exist
        //before the app was open
        FCM.getInitialNotification().then(notif => {
            //if the app was opened by press on the notification tray
            if (notif.local_notification) {
                NavigationService.navigate(notif.targetScreen);
            }
            if (notif.invoiceId) {
                console.log(notif.invoiceId);
                NavigationService.navigate("Shipper", {invoiceId: notif.invoiceId});
                //if this is a receipt notification
                //then update the invoice status
                if (notif.receiptDate !== "false") {
                    //TODO: Update invoice status
                    this.props.tryUpdateInvoiceStatus(notif.invoiceId, notif.receiptDate);
                }else {
                    this.props.tryUpdateInvoiceStatus(notif.invoiceId);
                }
            }
        });

        //setup push notification
        //this method only doesn't be triggerd when app was killed
        FCM.on(FCMEvent.Notification, notif => {
            if (notif.fcm) {
                FCM.presentLocalNotification({
                    id: "UNIQ_ID_STRING",                               // (optional for instant notification)
                    title: notif.fcm.title,                     // as FCM payload
                    body: notif.fcm.body,                    // as FCM payload (required)
                    sound: "default",                                   // as FCM payload
                    priority: "high",                                   // as FCM payload
                    large_icon: "ic_launcher",
                    icon: "ic_launcher",
                    color: "red",
                    vibrate: 300,
                    group: "group",
                    lights: true,
                    show_in_foreground: true
                });
            }

            if (notif.local_notification) {
                NavigationService.navigate(notif.targetScreen);
            }
            if (notif.invoiceId) {
                console.log(notif.invoiceId);
                NavigationService.navigate("Shipper", {invoiceId: notif.invoiceId});
                //if this is a receipt notification
                //then update the invoice status
                if (notif.receiptDate !== "false") {
                    //TODO: Update invoice status
                    this.props.tryUpdateInvoiceStatus(notif.invoiceId, notif.receiptDate);
                }else {
                    this.props.tryUpdateInvoiceStatus(notif.invoiceId);
                }
            }
        });
    }


    render() {
        return <RootStack style={styles.container} ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
        }}/>;
        //return <Record/>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});


const Tabs = TabNavigator(
    {
        Store: {screen: Screens.Store},
        Invoice: {screen: Screens.Invoice},
        Profile: {screen: Screens.Profile},
        History: {screen: Screens.History},
    },
    {
        navigationOptions: ({navigation}) => ({
            tabBarIcon: ({focused, tintColor}) => {
                const {routeName} = navigation.state;
                let iconName;
                switch (routeName) {
                    case ('Store'):
                        iconName = 'store';
                        break;
                    case ('Invoice'):
                        iconName = 'receipt';
                        break;
                    case ('Profile'):
                        return <Ionicon name="ios-contact" size={25} color={tintColor}/>
                    case ('History'):
                        return <Ionicon name="ios-folder-open-outline" size={25} color={tintColor}/>
                }

                return <Icon name={iconName} size={25} color={tintColor}/>;
            },
        }),
        tabBarComponent: TabBarBottom,
        tabBarPosition: 'bottom',
        animationEnabled: true,
        swipeEnabled: false,
        tabBarOptions: {
            showLabel: false,
            activeTintColor: ui.colors.black,
            inactiveTintColor: ui.colors.light_gray,
            style: {
                backgroundColor: ui.colors.white,
                borderTopWidth: 1,
                borderTopColor: ui.colors.smoke
            },
        },
    }
);

const RootStack = StackNavigator(
    {
        Home: {
            screen: Tabs,
        },
        Location: {
            screen: Screens.Location
        },
        Reminder: {
            screen: Screens.Reminder
        },
        Shipper: {
            screen: Screens.Shipper
        },
        FbSignUp: {
            screen: Screens.FbSignUp
        },
        Register: {
            screen: Screens.Register
        }
    },
    {
        initialRouteName: 'Home',
        navigationOptions: {
            header: null,
        },
    }
);


const mapDispatchToProps = dispatch => {
    return {
        tryGetLocalCustomer: () => dispatch(tryGetLocalCustomer()),
        tryUpdateInvoiceStatus: (_id, date) => dispatch(tryUpdateInvoiceStatus(_id, date))
    }
}

export default connect(null, mapDispatchToProps)(App);





