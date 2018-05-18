import React from 'react';
import { StyleSheet, View, Text, Dimensions, CheckBox } from 'react-native';
import ui from '../../share/ui.constant';
export default class NotiPanel extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.panel}>
                    <Text style={styles.titleTxt}>Chúc mừng</Text>
                    <Text style={styles.subTxt}>Bạn đã đặt hàng thành công, chúng tôi sẽ giao hàng trong thời gian sớm nhất</Text>
                    <CheckBox />
                </View>
            </ View>
        )
    }
}
const _width = Dimensions.get('window').width;
const _height = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container: {
        width: _width,
        height: _height,
        backgroundColor: 'rgba(0,0,0,0.6)',
        elevation: 4,
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    panel: {
        width: _width * 0.8,
        height: _width * 0.8,
        backgroundColor: 'white',
        borderRadius: 12,

    },
    titleTxt: {
        fontFamily: ui.fonts.decor,
        fontSize: 52,
        color: 'black',

    },
    subTxt: {
        fontFamily: ui.fonts.thin,
        fontSize: ui.fontSize.semiTiny,
        color: 'black',
        textAlign: 'center'
    }
})