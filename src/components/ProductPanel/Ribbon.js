import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ui from '../../share/ui.constant';

export default Ribbon = (props) => {
    let { weight } = props;
    let anotation = 'kg';
    if (weight < 1) {
        weight *= 1000;
        anotation = 'g'
    };

    return (
        <View style={styles.ribbon} >
            <Text style={styles.ribbonTxt}>{`${weight}${anotation}`}</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    ribbon: {
        width: '100%',
        height: 22,
        top: 11,
        left: 'auto',
        right: "-38%",
        backgroundColor: ui.colors.dark_gray,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{
            rotate: '45deg'
        }],
        position: 'absolute',
        zIndex: 2,
        elevation: 4
    },
    ribbonTxt: {
        color: 'white',
        fontFamily: ui.fonts.bold,
        fontSize: ui.fontSize.semiTiny
    }
})