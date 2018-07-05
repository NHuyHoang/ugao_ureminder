import React from 'react';
import { View, StyleSheet, TouchableNativeFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

export default RoundedIconButton = (props) => (
    <TouchableNativeFeedback
        onPress={props.onPress}
        background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.3)', true)}>
        <View style={styles.iconBtnContainer}>
            <Icon name={props.name} size={20} color={props.color} />
        </View>
    </TouchableNativeFeedback>
)


const styles = StyleSheet.create({
    iconBtnContainer: {
        marginRight: 14,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    }
});