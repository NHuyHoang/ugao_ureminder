import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default class StoreNoti extends React.Component{
    render(){
        return (
            <View style={{ opacity:this.props.show ? 1 : 0 }}><Text>StoreNoti</Text></View>
        );

    }
}