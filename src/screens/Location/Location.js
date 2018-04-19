import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Header } from '../../components'

export default class Location extends React.PureComponent {
    render() {
        return (
            <View style={styles.container}>
                <Header data={[
                    { name: 'clear', onPress: () => this.props.navigation.goBack(), color: 'red' },
                ]} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerBtn: {
        marginRight: 12
    }
})