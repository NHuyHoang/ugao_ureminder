import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default class StoreContact extends React.Component{
    showScreen = () => {
        return this.props.show ?
            { opacity: 1, zIndex: 1, } : { opacity: 0, zIndex: 0, }
    }
    render(){
        return (
            <View style={this.showScreen()}><Text>StoreContact</Text></View>
        );

    }
}