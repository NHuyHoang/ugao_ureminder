import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import ui from '../../share/ui.constant';
import Icon from 'react-native-vector-icons/MaterialIcons'

export default ProductPanel = (props) => {
    return (
        <View style={styles.container}>
            <View style={styles.ImgContainer}>
                <Image style={styles.productImg} source={require('../../share/images/phuong-hoang.jpg')} />
                {/* <View style={styles.dimmer} /> */}
            </View>
            <View style={styles.InfoContainer}>
                <View style={styles.productNameContainer}>
                    <Text style={styles.productName}>Gạo Hạt Ngọc Trời Phượng Hoàng</Text>
                </View>
                <TouchableOpacity onPress={props.pressed} style={styles.addToCart}>
                    <Icon name="add-shopping-cart" size={20} color={ui.colors.black} />
                    <Text style={styles.productCost}>89.000 VND</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const _width = Dimensions.get('window').width;
const borderRadiusConst = 4;
const styles = StyleSheet.create({
    container: {
        height: 217.5,
        width: _width/2 - 20,
        borderRadius: borderRadiusConst,
        marginLeft: 8,
        marginRight: 8,
        elevation: 2,
        backgroundColor: 'white'
    },
    ImgContainer: {
        width: '100%',
        height: '60%',
    },
    productImg: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    },
    dimmer: {
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        opacity: 0.03,
        position: 'absolute',
        borderTopRightRadius: borderRadiusConst,
        borderTopLeftRadius: borderRadiusConst
    },
    InfoContainer: {
        width: '100%',
        height: '40%',
    },
    productNameContainer: {
        width: '100%',
        height: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 25,
        paddingRight: 25,
    },
    addToCart: {
        width: '100%',
        height: '40%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    productName: {
        fontFamily: ui.fonts.medium,
        fontSize: 12,
        color: ui.colors.dark_gray,
        textAlign: 'center'
    },
    productCost: {
        fontFamily: ui.fonts.bold,
        fontSize: 12,
        color: ui.colors.black
    }
})