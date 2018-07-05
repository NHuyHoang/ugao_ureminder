import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import ui from '../../share/ui.constant';

export default AltAvatar = (props) => {
    const genColor = () => { return '#' + Math.floor(Math.random() * 16777215).toString(16); }
    const backgroundColor = genColor();
    return (
        <View style={[styles.avatarContainer, { backgroundColor }]} >
            <Text style={styles.txt}>
                {props.char.charAt(0).toUpperCase()}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    avatarContainer: {
        height: 80.0,
        width: 80.0,
        justifyContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50.0
    },
    txt: {
        fontSize: 50.0,
        color: 'white',
        fontFamily: ui.fonts.default
    }
})