import React from 'react';
import { View, Text, StyleSheet, TouchableNativeFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default IconButton = (props) => {
    return (
        <View style={[{
            height: props.size,
            width: props.size,
            borderRadius: props.size * 0.2,

        }]}>
            <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.3)', true)}
                onPress={props.onPress}>
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1
                }}>
                    <Icon name={props.name} size={props.size * 0.6} color='black' />
                </View>
            </TouchableNativeFeedback>
        </View>
    )
}

/* const styles = StyleSheet.create({
    container: {

    }
}) */