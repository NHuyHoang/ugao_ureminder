import React from 'react';
import { StyleSheet, View, Text, TouchableNativeFeedback } from 'react-native';

import ui from '../../share/ui.constant';

export default FlatButton = (props) => {
    let color = ui.colors.highlight;
    if (props.disabled) color = 'grey';
    if (props.invert) color = 'white';
    return (
        <View style={[
            styles.container,
            {
                width: !props.width ? '100%' : props.width,
                height: !props.height ? 42 : props.height,
                backgroundColor: props.invert ? ui.colors.highlight : 'transparent'
            }]}>
            <TouchableNativeFeedback
                disabled={props.disabled}
                onPress={props.onPress}
                background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.2)', true)} >
                <View style={styles.inkwell}>
                    <Text style={
                        [styles.txt,
                        { color: props.color ? props.color : color }
                        ]}>
                        {props.title.toUpperCase()}
                    </Text>
                </View>
            </TouchableNativeFeedback>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        borderRadius: 4.0,
    },
    inkwell: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',

    },
    txt: {
        fontSize: ui.fontSize.normal,
        fontFamily: ui.fonts.bold,
    }
})