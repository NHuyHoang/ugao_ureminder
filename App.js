import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TabNavigator, TabBarBottom, StackNavigator } from 'react-navigation';
import * as Screens from './src/screens';
import ui from './src/share/ui.constant'

export default class App extends React.Component {
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
          case ('Profile'): iconName = 'perm-identity'; break;
          case ('History'): iconName = 'account-balance-wallet'; break;
        }
        return <Icon name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
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
    Location:{
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
