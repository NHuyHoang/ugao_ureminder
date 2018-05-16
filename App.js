import React from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { TabNavigator, TabBarBottom, StackNavigator } from 'react-navigation';
import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType, NotificationActionType, NotificationActionOption, NotificationCategoryOption } from "react-native-fcm";
import * as Screens from './src/screens';
import ui from './src/share/ui.constant'

export default class App extends React.Component {

  componentDidMount() {
    FCM.getInitialNotification().then(notif => {
      console.log("received", notif);
    });


    FCM.on(FCMEvent.Notification, notif => {
      console.log("Notification", notif);
      //this.scheduleLocalNotification();
      if (notif.fcm) {
        FCM.presentLocalNotification({
          id: "UNIQ_ID_STRING",                               // (optional for instant notification)
          title: displayNoti.title,                     // as FCM payload
          body: displayNoti.body,                    // as FCM payload (required)
          sound: "default",                                   // as FCM payload
          priority: "high",                                   // as FCM payload
          large_icon: "ic_launcher",                           // Android only
          icon: "ic_launcher",                                // as FCM payload, you can relace this with custom icon you put in mipmap
          big_text: "Show when notification is expanded",     // Android only
          sub_text: "This is a subText",                      // Android only
          color: "red",                                       // Android only
          vibrate: 300,                                       // Android only default: 300, no vibration if you pass null
          tag: 'correcto',                                    // Android only
          group: "group",                                     // Android only
          lights: true,                                       // Android only, LED blinking (default false)
          show_in_foreground: true                                 // notification when app is in foreground (local & remote)
        });
      }
      if (notif.opened_from_tray) {
        if (notif.targetScreen === 'detail') {
          setTimeout(() => {
            navigation.navigate('Detail')
          }, 500)
        }
        setTimeout(() => {
          alert(`User tapped notification\n${JSON.stringify(notif)}`)
        }, 500)
      }

    });


    AsyncStorage.getItem("FCM:token")
      .then(data => {
        if (!data) {
          FCM.getFCMToken().then(token => {

            AsyncStorage.setItem("FCM:token", token);
          })
        }
        console.log(data)
      })

  }


  render() {
    return <RootStack style={styles.container} />;
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
    Store: { screen: Screens.Store },
    Invoice: { screen: Screens.Invoice },
    Profile: { screen: Screens.Profile },
    History: { screen: Screens.History },
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        switch (routeName) {
          case ('Store'): iconName = 'store'; break;
          case ('Invoice'): iconName = 'receipt'; break;
          case ('Profile'): return <Ionicon name="ios-contact" size={25} color={tintColor} />
          case ('History'): return <Ionicon name="ios-folder-open-outline" size={25} color={tintColor} />
        }

        return <Icon name={iconName} size={25} color={tintColor} />;
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
    }
  },
  {
    initialRouteName: 'Home',
    navigationOptions: {
      header: null,
    },
  }
);
