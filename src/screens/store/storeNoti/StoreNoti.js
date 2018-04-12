import React from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';

export default class StoreNoti extends React.Component {
    render() {
        return (
            <View style={[styles.container,{ opacity: this.props.show ? 1 : 0 }]}>
                 <Text>Notification</Text>
            </View>
        );

    }
}

const NotiItem = (props) => {
    return (
        <View style={styles.notiPanel} >
            <Text>Notification</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        top: 100,
        bottom: 0,
        backgroundColor: 'white',
        position: 'absolute',
        zIndex: 2
    },
})