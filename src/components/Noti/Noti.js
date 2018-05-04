import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import ui from '../../share/ui.constant';

export default Noti = props => {
    return (
        <View style={{
            width: '100%',
            height: 20,
            backgroundColor: ui.colors.yellow,
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Text
                style={{
                    color: 'white',
                    fontFamily: ui.fonts.bold,
                    fontSize: ui.fontSize.semiTiny
                }}>{props.message ? props.message : "Đã xảy ra lỗi"}</Text>
        </View>
    )
}